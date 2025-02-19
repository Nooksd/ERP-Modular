package main

import (
	"log"
	"os"
	"time"

	middleware "controll/src/middlewares"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"controll/src/routes"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Aviso: Não foi possível carregar o arquivo .env")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8800"
	}

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://localhost:5173", "https://controll.innova-energy.com.br"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length", "Set-Cookie"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	routes.AuthRoutes(router)

	authProtected := router.Group("/")
	authProtected.Use(middleware.Authenticate())

	routes.UserRoutes(authProtected)
	routes.HHControllerRoutes(authProtected)
	routes.WorkRoutes(authProtected)
	routes.EmployeeRoutes(authProtected)
	routes.ActivityRoutes(authProtected)
	routes.RoleRoutes(authProtected)
	routes.PageRoutes(authProtected)

	router.NoRoute(func(c *gin.Context) {
		c.JSON(404, gin.H{
			"message": "Endpoint não encontrado",
			"status":  false,
		})
	})

	log.Printf("Servidor rodando na porta %s", port)

	if err := router.Run("0.0.0.0:" + port); err != nil {
		log.Fatal("Erro ao iniciar servidor:", err)
	}
}
