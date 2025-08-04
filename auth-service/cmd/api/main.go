package main

import (
	"auth-service/internal/server"
	"auth-service/pkg/utils/jwt"
	"os"

	"github.com/vityasyyy/sharedlib/db"
	"github.com/vityasyyy/sharedlib/logger"
	"github.com/vityasyyy/sharedlib/metrics"
	serverPkg "github.com/vityasyyy/sharedlib/server"
)

func main() {
	production := os.Getenv("ENVIRONMENT") == "production"
	serviceName := os.Getenv("SERVICE_NAME")

	jwt.InitKeys()
	logger.InitLogger(serviceName, production)
	metrics.InitPrometheus()

	driver := os.Getenv("DB_DRIVER")
	dbURL := os.Getenv("DB_URL")
	database := db.MustConnect(driver, dbURL)
	defer database.Close()

	router := server.NewRouter(database)

	serverPkg.RunGracefully(os.Getenv("PORT"), router, database)
}
