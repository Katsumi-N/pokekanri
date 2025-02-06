package inventory

type Card interface {
	GetId() int
	GetName() string
	GetCardTypeId() int
}
