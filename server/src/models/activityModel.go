package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SubActivity struct {
	SubActivity    string `bson:"subactivity" json:"subactivity" validate:"required"`
	HaveIndicative bool   `bson:"haveIndicative,omitempty" json:"haveIndicative"`
}

type ActivitySchema struct {
	Activity      string        `bson:"activity" json:"activity" validate:"required"`
	SubActivities []SubActivity `bson:"subactivities,omitempty" json:"subactivities" validate:"required"`
}

type Activity struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Area       string             `bson:"area" json:"area" validate:"required"`
	Activities []ActivitySchema   `bson:"activities" json:"activities" validate:"required"`
}
