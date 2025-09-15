import { Image } from "expo-image";

import { View } from "@/components/themed";
import { useCourse } from "@/context/course";

const soliIcon = require("@/assets/mascotte/soli-happy.png");

interface Props {
  excludes?: any;
}

export function SelectCourse({ excludes }: Props) {
  const { courseId } = useCourse();

  if (!courseId) return null;

  return (
    <View
      style={{
        height: 32,
        width: 32,
        overflow: "hidden",
      }}
    >
      <Image
        source={soliIcon}
        contentFit="contain"
        style={{ flex: 1 }}
      />
    </View>
  );
}
