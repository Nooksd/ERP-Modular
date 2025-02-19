package routes

import (
	"controll/src/controllers"

	middleware "controll/src/middlewares"

	"github.com/gin-gonic/gin"
)

func AuthRoutes(router *gin.Engine) {
	auth := router.Group("/api/auth")
	{
		auth.POST("/login", controllers.Login())
		auth.POST("/logout", controllers.Logout())
		auth.GET("/refresh-token", middleware.Authenticate(), controllers.RefreshToken())
	}
}
