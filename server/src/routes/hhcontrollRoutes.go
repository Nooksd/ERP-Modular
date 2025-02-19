package routes

import (
	"controll/src/controllers"

	"github.com/gin-gonic/gin"
)

func HHControllerRoutes(router *gin.RouterGroup) {
	hh := router.Group("/api/hhcontroll")
	{
		hh.POST("/sendHH", controllers.SendHH())
		hh.GET("/get-record/:recordId", controllers.GetHHRecord())
		hh.GET("/get-last-record/:projectId", controllers.GetLastHHRecord())
		hh.GET("/get-history/:projectId", controllers.GetHHRecordsByProject())
		hh.PUT("/update/:recordId", controllers.UpdateRecord())
		hh.DELETE("/delete/:recordId", controllers.DeleteRecord())
		hh.GET("/get-statistics/:projectId", controllers.GetStatistics())
		hh.GET("/get-pdf-base", controllers.GetPdf())
	}
}
