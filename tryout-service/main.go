package main

import (
	"log"
	"os"
	"tryout-service/internal/server"

	pb "tryout-service/internal/proto/soal"

	"github.com/vityasyyy/sharedlib/db"
	"github.com/vityasyyy/sharedlib/jwt"
	"github.com/vityasyyy/sharedlib/logger"
	"github.com/vityasyyy/sharedlib/metrics"
	serverPkg "github.com/vityasyyy/sharedlib/server"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func main() {
	production := os.Getenv("ENVIRONMENT") == "production"
	serviceName := os.Getenv("SERVICE_NAME")
	jwksURL := os.Getenv("JWKS_URL")

	jwt.InitJWKS(jwksURL)
	logger.InitLogger(serviceName, production)
	metrics.InitPrometheus()

	driver := os.Getenv("DB_DRIVER")
	dbURL := os.Getenv("DB_URL")
	database := db.MustConnect(driver, dbURL)
	defer database.Close()

	soalServiceAddr := os.Getenv("SOAL_SERVICE_GRPC_ADDR")
	if soalServiceAddr == "" {
		log.Fatalf("SOAL_SERVICE_GRPC_ADDR environment variable is not set")
	}

	conn, err := grpc.NewClient(soalServiceAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Failed to connect to Soal Service gRPC server at %s: %v", soalServiceAddr, err)
	}
	defer conn.Close()

	soalServiceClient := pb.NewSoalServiceClient(conn)
	router := server.NewRouter(database, soalServiceClient)

	serverPkg.RunGracefully(os.Getenv("PORT"), router, database)
}
