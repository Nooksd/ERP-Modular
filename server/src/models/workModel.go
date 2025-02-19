package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Work struct {
	ID         primitive.ObjectID   `bson:"_id,omitempty" json:"id"`
	Name       string               `bson:"name" json:"name" validate:"required"`
	Location   string               `bson:"location" json:"location" validate:"required"`
	CNO        int                  `bson:"cno" json:"cno" validate:"required"`
	StartDate  time.Time            `bson:"startDate,omitempty" json:"startDate,omitempty"`
	EndDate    time.Time            `bson:"endDate,omitempty" json:"endDate,omitempty"`
	IsActive   bool                 `bson:"isActive" json:"isActive"`
	ManagerIDs []primitive.ObjectID `bson:"managerIds,omitempty" json:"managerIds,omitempty"`
}
