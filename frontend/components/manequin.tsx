import { View, ActivityIndicator, useWindowDimensions } from "react-native";
import { Canvas, Image as SkiaImage, useImage } from "@shopify/react-native-skia";


type Wardrobe = {
  _id: string;
  top: string[] | any;
  bottom: string[] | any;
  shoes: string[] | any;
};

export default function WardrobeSkia({wardrobe } : { wardrobe: Wardrobe }) {
  const { width } = useWindowDimensions();


  const mannequin = useImage(require('../assets/images/manequin.png'));
  const topImg = useImage(
  wardrobe?.top?.[0]?.imageUrl || require('../assets/images/top.png')
);
const bottomImg = useImage(
  wardrobe?.bottom?.[0]?.imageUrl || require('../assets/images/bottom.png')
);
const shoesImg = useImage(
  wardrobe?.shoes?.[0]?.imageUrl || require('../assets/images/shoes.png')
);

  if ( !mannequin || !topImg || !bottomImg || !shoesImg) return <ActivityIndicator size="large" color="#000" />;

  


  return (
    <View style={{ flex: 1, backgroundColor: "white", alignItems: "center", justifyContent: "center" }}>
      <Canvas style={{ width: width * 0.7, height: width * 1.4 }}>
        {/* Mannequin */}
        <SkiaImage image={mannequin} x={0} y={5} width={width * 0.7} height={width * 1.4} />
        {/* Top */}
        <SkiaImage image={topImg} x={width * 0.25} y={width * 0.4} width={width * 0.2} height={width * 0.35} />

        {/* Bottom */}
        <SkiaImage image={bottomImg} x={width * 0.20} y={width * 0.63} width={width * 0.3} height={width * 0.35} />

        {/* Shoes */}
        <SkiaImage image={shoesImg} x={width * 0.28} y={width * 0.92} width={width * 0.15} height={width * 0.15} />
      </Canvas>
    </View>
  );
}