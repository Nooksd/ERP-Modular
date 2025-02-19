package routes

import (
	"controll/src/controllers"

	"github.com/gin-gonic/gin"
)

func WorkRoutes(router *gin.RouterGroup) {
	work := router.Group("/api/work")
	{
		work.GET("/get-one/:workId", controllers.GetWork())
		work.GET("/get-user-works", controllers.GetUserWorks())
		work.POST("/create", controllers.CreateWork())
		work.GET("/get-all", controllers.GetAllWorks())
		work.PUT("/update/:workId", controllers.UpdateWork())
		work.DELETE("/delete/:workId", controllers.DeleteWork())
	}
}
