package grpc

import (
	"context"
	"log"
	"os"
	"strings"
	"time"

	"github.com/MicahParks/keyfunc" // Use the JWKS library
	"github.com/golang-jwt/jwt/v4"  // Use the JWT library
	"github.com/vityasyyy/sharedlib/logger"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

// We need to define the claims struct, as we can't access the one from auth-service
type AccessTokenClaims struct {
	UserID      int    `json:"user_id"`
	Email       string `json:"email"`
	NamaUser    string `json:"nama_user"`
	AsalSekolah string `json:"asal_sekolah"`
	jwt.RegisteredClaims
}

// jwks will hold the public keys fetched from auth-service
var jwks *keyfunc.JWKS

// InitAuthInterceptor fetches the JWKS keys and prepares the interceptor.
// This MUST be called from main.go
func InitAuthInterceptor() {
	jwksURL := os.Getenv("JWKS_URL") // e.g., "http://auth-service-api:8080/user/.well-known/jwks.json"
	if jwksURL == "" {
		log.Fatal("JWKS_URL environment variable is not set")
	}

	// Set up a new JWKS options with a refresh interval
	options := keyfunc.Options{
		RefreshInterval: time.Hour,
		Ctx:             context.Background(),
	}

	// Create the JWKS from the URL
	var err error
	jwks, err = keyfunc.Get(jwksURL, options)
	if err != nil {
		log.Fatalf("Failed to get JWKS from %s: %v", jwksURL, err)
	}
}

// AuthInterceptor is the gRPC middleware
func AuthInterceptor(ctx context.Context, req any, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (any, error) {
	// 1. Check if jwks has been initialized
	if jwks == nil {
		logger.LogErrorCtx(ctx, nil, "gRPC Auth: Interceptor not initialized, JWKS is nil")
		return nil, status.Error(codes.Internal, "authentication system not ready")
	}

	// 2. Extract token string from metadata
	tokenString, err := extractTokenFromContext(ctx)
	if err != nil {
		logger.LogErrorCtx(ctx, err, "gRPC Auth: Failed to extract token")
		return nil, err
	}

	// 3. Parse and validate the token
	claims := &AccessTokenClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, jwks.Keyfunc)
	if err != nil {
		logger.LogErrorCtx(ctx, err, "gRPC Auth: Token validation failed")
		return nil, status.Error(codes.Unauthenticated, "invalid token")
	}

	if !token.Valid {
		logger.LogErrorCtx(ctx, nil, "gRPC Auth: Token is invalid")
		return nil, status.Error(codes.Unauthenticated, "invalid token")
	}

	// 4. Add claims to context for the handler
	ctxWithClaims := context.WithValue(ctx, "user_id", claims.UserID)
	ctxWithClaims = context.WithValue(ctxWithClaims, "email", claims.Email)
	ctxWithClaims = context.WithValue(ctxWithClaims, "username", claims.NamaUser)
	ctxWithClaims = context.WithValue(ctxWithClaims, "asal_sekolah", claims.AsalSekolah)
	ctxWithClaims = context.WithValue(ctxWithClaims, "claims", claims)

	// 5. Call the actual gRPC handler
	return handler(ctxWithClaims, req)
}

// extractTokenFromContext is a helper to get the token string
func extractTokenFromContext(ctx context.Context) (string, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return "", status.Error(codes.Unauthenticated, "metadata is not provided")
	}

	cookieHeaders, ok := md["cookie"]
	if !ok || len(cookieHeaders) == 0 {
		return "", status.Error(codes.Unauthenticated, "authentication token is not provided in metadata")
	}

	cookieStr := strings.Join(cookieHeaders, "; ")
	cookies := strings.Split(cookieStr, ";")
	for _, cookie := range cookies {
		cookie = strings.TrimSpace(cookie)
		if strings.HasPrefix(cookie, "access_token=") {
			return strings.TrimPrefix(cookie, "access_token="), nil
		}
	}

	return "", status.Error(codes.Unauthenticated, "access_token is missing")
}
