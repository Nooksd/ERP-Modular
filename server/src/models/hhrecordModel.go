package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RoleDetails struct {
	Role     string  `bson:"role" json:"role" validate:"required"`
	Quantity int     `bson:"quantity" json:"quantity" validate:"required"`
	Hours    float64 `bson:"hours" json:"hours" validate:"required"`
}

type HHRecordItem struct {
	Area            string        `bson:"area" json:"area" validate:"required"`
	Activity        string        `bson:"activity" json:"activity" validate:"required"`
	SubActivity     string        `bson:"subactivity" json:"subactivity" validate:"required"`
	WorkDescription string        `bson:"workDescription" json:"workDescription" validate:"required"`
	Indicative      string        `bson:"indicative,omitempty" json:"indicative,omitempty"`
	Roles           []RoleDetails `bson:"roles" json:"roles"`
}

type HHRecord struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"userId" json:"userId" validate:"required"`
	ProjectID primitive.ObjectID `bson:"projectId" json:"projectId" validate:"required"`
	Date      time.Time          `bson:"date" json:"date" validate:"required"`
	HHRecords []HHRecordItem     `bson:"hhRecords" json:"hhRecords" validate:"required"`
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt" validate:"required"`
}
