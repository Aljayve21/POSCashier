import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
type Slide = {
  id: number;
  image: any;
  title: string;
  description: string;
};

export default function HomeScreen() {
  const slides: Slide[] = useMemo(
    () => [
      {
        id: 1,
        image: require("../../assets/images/onboarding-store.jpg"),
        title: "SMART POS Inventory Systems",
        description:
          "Manage products, inventory, sales, and customers in one simple system.",
      },
      {
        id: 2,
        image: require("../../assets/images/onboarding-store.jpg"),
        title: "Track Sales Easily",
        description:
          "Monitor transactions, payment methods, and customer purchases with ease.",
      },
      {
        id: 3,
        image: require("../../assets/images/onboarding-store.jpg"),
        title: "Handle Utang and Payments",
        description:
          "Keep track of receivables, due labels, and payment history in one place.",
      },
    ],
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;

  const animateSlideChange = (nextIndex: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: -20,
        duration: 180,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex(nextIndex);

      translateAnim.setValue(20);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: 0,
          duration: 220,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      animateSlideChange(currentIndex + 1);
    } else {
      router.push("/auth/login");
    }
  };

  const handleSkip = () => {
    if (currentIndex !== slides.length - 1) {
      animateSlideChange(slides.length - 1);
    } else {
      router.push("/auth/login");
    }
  };

  const currentSlide = slides[currentIndex];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: 24,
          justifyContent: "space-between",
        }}
      >
        <Animated.View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            opacity: fadeAnim,
            transform: [{ translateX: translateAnim }],
          }}
        >
          <Image
            source={currentSlide.image}
            resizeMode="contain"
            style={{
              width: 260,
              height: 260,
              marginBottom: 32,
            }}
          />

          <Text
            style={{
              fontSize: 30,
              fontWeight: "700",
              color: "#1F2937",
              textAlign: "center",
              marginBottom: 14,
            }}
          >
            {currentSlide.title}
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: "#6B7280",
              textAlign: "center",
              lineHeight: 22,
              paddingHorizontal: 12,
              maxWidth: 320,
            }}
          >
            {currentSlide.description}
          </Text>
        </Animated.View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={handleSkip}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Skip
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {slides.map((_, index) => {
              const isActive = index === currentIndex;

              return (
                <View
                  key={index}
                  style={{
                    width: isActive ? 22 : 8,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: isActive ? "#7F00FF" : "#D1D5DB",
                    marginHorizontal: 4,
                  }}
                />
              );
            })}
          </View>

          <TouchableOpacity onPress={handleNext}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#374151",
              }}
            >
              {currentIndex === slides.length - 1 ? "Done" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}