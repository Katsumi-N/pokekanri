import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchCardDetail } from "@/lib/fetch-card-detail";
import { PokemonCardDetail, TrainerCardDetail, EnergyCardDetail } from "@/lib/card";
import { shouldLoginAlert } from "@/components/ui/should-login";
import { cookies } from "next/headers";
import InventoryQuantityEditor from "@/components/ui/inventory-quantity-editor";

interface DetailPageProps {
  params: {
    card_type: string;
    id: string;
  };
  searchParams: {
    quantity?: string;
  }
}

export default async function DetailPage({ params, searchParams }: DetailPageProps) {
  const { card_type, id } = params;
  const cardId = parseInt(id, 10);

  const quantity = searchParams.quantity ? parseInt(searchParams.quantity, 10) : 0;
  try {
    const data = await fetchCardDetail(card_type, cardId);
    
    // カードタイプが存在しない場合は404を返す
    if (
      (card_type === "pokemon" && !data.pokemon) || 
      (card_type === "trainer" && !data.trainer) || 
      (card_type === "energy" && !data.energy)
    ) {
      return notFound();
    }
    
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 flex justify-center p-6 bg-gray-50">
              <div className="w-64 relative">
                <Image 
                  src={`/images/${getImageUrl(data, card_type)}`}
                  alt={getCardName(data, card_type)}
                  width={256}
                  height={384}
                  className="rounded-lg"
                />
                {quantity > 0 && (
                  <div className="inline-block bg-black bg-opacity-50 text-white px-3 py-1 rounded-tr-md">
                    所持: {quantity}枚
                  </div>
                )}
                <div className="inline-block">
                  <InventoryQuantityEditor
                    cardId={cardId}
                    cardType={card_type}
                    initialQuantity={quantity}
                  />
                </div>
              </div>

            </div>

            <div className="md:w-1/2 p-6">
              <div className="mb-4">
                <h1 className="text-2xl font-bold">{getCardName(data, card_type)}</h1>
                {card_type === "pokemon" && data.pokemon && (
                  <p className="text-gray-600">
                    {data.pokemon.energy_type} • HP {data.pokemon.hp}
                  </p>
                )}
                {card_type === "trainer" && data.trainer && (
                  <p className="text-gray-600">
                    トレーナーカード • {data.trainer.trainer_type}
                  </p>
                )}
                {card_type === "energy" && data.energy && (
                  <p className="text-gray-600">エネルギーカード</p>
                )}
              </div>
              
              <div className="mb-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  {renderCardDetails(data, card_type)}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                    {getRegulation(data, card_type)}
                  </div>
                  <div className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                    {getExpansion(data, card_type)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching card detail:", error);
    return notFound();
  }
}

function getImageUrl(data: any, cardType: string): string {
  if (cardType === "pokemon" && data.pokemon) return data.pokemon.image_url;
  if (cardType === "trainer" && data.trainer) return data.trainer.image_url;
  if (cardType === "energy" && data.energy) return data.energy.image_url;
  return "";
}

function getCardName(data: any, cardType: string): string {
  if (cardType === "pokemon" && data.pokemon) return data.pokemon.name;
  if (cardType === "trainer" && data.trainer) return data.trainer.name;
  if (cardType === "energy" && data.energy) return data.energy.name;
  return "";
}

function getRegulation(data: any, cardType: string): string {
  if (cardType === "pokemon" && data.pokemon) return data.pokemon.regulation || "なし";
  if (cardType === "trainer" && data.trainer) return data.trainer.regulation || "なし";
  if (cardType === "energy" && data.energy) return data.energy.regulation || "なし";
  return "なし";
}

function getExpansion(data: any, cardType: string): string {
  if (cardType === "pokemon" && data.pokemon) return data.pokemon.expansion || "なし";
  if (cardType === "trainer" && data.trainer) return data.trainer.expansion || "なし";
  if (cardType === "energy" && data.energy) return data.energy.expansion || "なし";
  return "なし";
}

function renderCardDetails(data: any, cardType: string) {
  if (cardType === "pokemon" && data.pokemon) {
    const pokemon = data.pokemon as PokemonCardDetail;
    console.log(pokemon);
    return (
      <div>
        {pokemon.ability && (
          <div className="mb-4">
            <h3 className="font-bold text-lg">{pokemon.ability}</h3>
            <p>{pokemon.ability_description}</p>
          </div>
        )}
        
        <h3 className="font-bold mb-2 mt-4">ワザ</h3>
        {pokemon.attacks && pokemon.attacks.map((attack, index) => (
          <div key={index} className="mb-3 pb-3 border-b border-gray-200 last:border-0">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">{attack.name}</h4>
              <div className="flex items-center">
                <span className="text-sm bg-gray-200 px-2 py-1 rounded mr-2">{attack.required_energy}</span>
                <span className="font-bold">{attack.damage}</span>
              </div>
            </div>
            <p className="text-sm mt-1">{attack.description}</p>
          </div>
        ))}
      </div>
    );
  }
  
  if (cardType === "trainer" && data.trainer) {
    const trainer = data.trainer as TrainerCardDetail;
    return (
      <div>
        <p>{trainer.description}</p>
      </div>
    );
  }
  
  if (cardType === "energy" && data.energy) {
    const energy = data.energy as EnergyCardDetail;
    return (
      <div>
        <p>{energy.description || "特別な効果はありません。"}</p>
      </div>
    );
  }
  
  return null;
}
