package domain

type CardType int

const (
	Pokemon CardType = 1
	Trainer CardType = 2
	Energy  CardType = 3
)

var CardTypeToString = map[CardType]string{
	Pokemon: "pokemon",
	Trainer: "trainer",
	Energy:  "energy",
}

var StringToCardType = map[string]CardType{
	"pokemon": Pokemon,
	"trainer": Trainer,
	"energy":  Energy,
}
