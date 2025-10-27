package main

import (
	"fmt"
	"log"
	"net"
	"os"
	internalGrpc "soal-service/internal/grpc"
	pb "soal-service/internal/proto/soal"
	"soal-service/internal/server"

	"github.com/vityasyyy/sharedlib/db"
	"github.com/vityasyyy/sharedlib/jwt"
	"github.com/vityasyyy/sharedlib/logger"
	"github.com/vityasyyy/sharedlib/metrics"
	serverPkg "github.com/vityasyyy/sharedlib/server"
	"google.golang.org/grpc"
)

func main() {
	production := os.Getenv("ENVIRONMENT") == "production"
	serviceName := os.Getenv("SERVICE_NAME")
	jwksURL := os.Getenv("JWKS_URL")

	jwt.InitJWKS(jwksURL)
	internalGrpc.InitAuthInterceptor()
	logger.InitLogger(serviceName, production)
	metrics.InitPrometheus()

	driver := os.Getenv("DB_DRIVER")
	dbURL := os.Getenv("DB_URL")
	database := db.MustConnect(driver, dbURL)
	defer database.Close()

	go func() {
		grpcPort := os.Getenv("GRPC_PORT")
		if grpcPort == "" {
			grpcPort = "50051"
		}

		listen, err := net.Listen("tcp", fmt.Sprintf(":%s", grpcPort))
		if err != nil {
			log.Fatalf("Failed to listen on port %s: %v", grpcPort, err)
		}

		_, soalService := server.NewRouter(database)

		s := grpc.NewServer(
			grpc.UnaryInterceptor(internalGrpc.AuthInterceptor),
		)

		pb.RegisterSoalServiceServer(s, internalGrpc.NewGRPCServer(soalService))

		log.Printf("gRPC server is listening on %v", listen.Addr())

		if err := s.Serve(listen); err != nil {
			log.Fatalf("Failed to serve gRPC server over port %s: %v", grpcPort, err)
		}
	}()

	router, _ := server.NewRouter(database)

	serverPkg.RunGracefully(os.Getenv("PORT"), router, database)
}
