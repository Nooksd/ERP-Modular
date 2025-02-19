package routes

import (
	"controll/src/controllers"

	"github.com/gin-gonic/gin"
)

func PageRoutes(router *gin.RouterGroup) {
	page := router.Group("/api/page")
	{
		page.POST("/add-page", controllers.CreatePage())
		page.GET("/get-all", controllers.GetAllPages())
	}
}
