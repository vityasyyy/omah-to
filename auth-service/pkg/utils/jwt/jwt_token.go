package jwt

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"encoding/hex"
	"encoding/pem"
	"errors"
	"fmt"
	"math/big"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// ---- KEY STRUCTURES ----
type JWK struct {
	Kty string `json:"kty"`
	Kid string `json:"kid"`
	Use string `json:"use"`
	Alg string `json:"alg"`
	N   string `json:"n"`
	E   string `json:"e"`
}

type JWKS struct {
	Keys []JWK `json:"keys"`
}

var (
	privateKeys  = make(map[string]*rsa.PrivateKey)
	publicKeys   = make(map[string]*rsa.PublicKey)
	currentKeyID = "key-2025-07" // Update this when rotating keys
)

// ---- CLAIMS ----
type AccessTokenClaims struct {
	UserID      int    `json:"user_id"`
	Email       string `json:"email"`
	NamaUser    string `json:"nama_user"`
	AsalSekolah string `json:"asal_sekolah"`
	jwt.RegisteredClaims
}

// ---- INIT KEYS ----
func InitKeys() {
	directoryName := "keys"
	if err := loadKeys(directoryName); err != nil {
		panic(fmt.Sprintf("failed to load keys: %v", err))
	}
}

// ---- KEY LOADING ----
func loadKeys(dir string) error {
	files, err := os.ReadDir(dir)
	if err != nil {
		return err
	}

	for _, f := range files {
		if strings.HasSuffix(f.Name(), ".pem") && !strings.HasSuffix(f.Name(), ".pub.pem") {
			privKey, pubKey, err := loadKeyPair(filepath.Join(dir, f.Name()))
			if err != nil {
				return err
			}
			privateKeys[currentKeyID] = privKey
			publicKeys[currentKeyID] = pubKey
		}
	}
	if len(privateKeys) == 0 {
		return errors.New("no keys loaded from directory")
	}
	return nil
}

func loadKeyPair(privPath string) (*rsa.PrivateKey, *rsa.PublicKey, error) {
	privBytes, err := os.ReadFile(privPath)
	if err != nil {
		return nil, nil, err
	}

	block, _ := pem.Decode(privBytes)
	if block == nil || block.Type != "PRIVATE KEY" {
		return nil, nil, fmt.Errorf("invalid private key")
	}

	privKey, err := x509.ParsePKCS8PrivateKey(block.Bytes)
	if err != nil {
		return nil, nil, err
	}

	rsaKey, ok := privKey.(*rsa.PrivateKey)
	if !ok {
		return nil, nil, fmt.Errorf("not RSA private key")
	}

	pubPath := strings.TrimSuffix(privPath, ".pem") + ".pub.pem"
	pubBytes, err := os.ReadFile(pubPath)
	if err != nil {
		return nil, nil, err
	}

	block, _ = pem.Decode(pubBytes)
	if block == nil || block.Type != "PUBLIC KEY" {
		return nil, nil, fmt.Errorf("invalid public key")
	}

	pubKey, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return nil, nil, err
	}

	rsaPubKey, ok := pubKey.(*rsa.PublicKey)
	if !ok {
		return nil, nil, fmt.Errorf("not RSA public key")
	}

	return rsaKey, rsaPubKey, nil
}

func getCurrentPrivateKey() *rsa.PrivateKey {
	return privateKeys[currentKeyID]
}

// ---- TOKEN CREATION ----
func CreateAccessToken(userID int, namaUser, asalSekolah, email string) (string, error) {
	expirationTime := time.Now().Add(15 * time.Minute)
	claims := AccessTokenClaims{
		UserID:      userID,
		Email:       email,
		NamaUser:    namaUser,
		AsalSekolah: asalSekolah,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	token.Header["kid"] = currentKeyID
	return token.SignedString(getCurrentPrivateKey())
}

func CreateRefreshToken() (string, error) {
	bytes := make([]byte, 32)
	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

// ---- TOKEN VALIDATION ----
func ValidateAccessToken(accessToken string) (*AccessTokenClaims, error) {
	token, err := jwt.ParseWithClaims(accessToken, &AccessTokenClaims{}, func(token *jwt.Token) (any, error) {
		if kid, ok := token.Header["kid"].(string); ok {
			if key, exists := publicKeys[kid]; exists {
				return key, nil
			}
			return nil, fmt.Errorf("unknown kid: %s", kid)
		}
		return nil, fmt.Errorf("kid header missing")
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*AccessTokenClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, jwt.ErrTokenInvalidClaims
}

// ---- PASSWORD RESET TOKEN ----
func CreateResetToken() (string, time.Time, error) {
	resetToken, err := CreateRefreshToken()
	if err != nil {
		return "", time.Time{}, err
	}
	resetTokenExpiredAt := time.Now().Add(30 * time.Minute)
	return resetToken, resetTokenExpiredAt, nil
}

// ---- JWKS GENERATION ----
func GetJWKS() JWKS {
	keys := []JWK{}
	for kid, pub := range publicKeys {
		n := base64.RawURLEncoding.EncodeToString(pub.N.Bytes())
		e := base64.RawURLEncoding.EncodeToString(big.NewInt(int64(pub.E)).Bytes())
		keys = append(keys, JWK{
			Kty: "RSA",
			Kid: kid,
			Use: "sig",
			Alg: "RS256",
			N:   n,
			E:   e,
		})
	}
	return JWKS{Keys: keys}
}
