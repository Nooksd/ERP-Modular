package routes

import (
	"controll/src/controllers"

	"github.com/gin-gonic/gin"
)

func ActivityRoutes(router *gin.RouterGroup) {
	activity := router.Group("/api/activity")
	{
		activity.GET("/get-all", controllers.GetAllActivities())
		activity.GET("/get-one/:activityId", controllers.GetActivity())
		activity.POST("/create", controllers.CreateActivity())
		activity.PUT("/update/:activityId", controllers.UpdateActivity())
		activity.DELETE("/delete/:activityId", controllers.DeleteActivity())
	}
}
