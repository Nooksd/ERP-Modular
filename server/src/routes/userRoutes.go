package routes

import (
	"controll/src/controllers"

	"github.com/gin-gonic/gin"
)

func UserRoutes(router *gin.RouterGroup) {
	user := router.Group("/api/user")
	{
		user.GET("/profile", controllers.GetProfile())
		user.POST("/create", controllers.CreateUser())
		user.GET("/get-all", controllers.GetAllUsers())
		user.GET("/get-managers", controllers.GetManagers())
		user.GET("/:userId", controllers.GetUserById())
		user.PUT("/update/:userId", controllers.UpdateUser())
		user.DELETE("/delete/:userId", controllers.DeleteUser())
	}
}
