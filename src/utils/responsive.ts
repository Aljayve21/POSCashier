export function getResponsiveMetrics(width: number) {
  const isTablet = width >= 768;
  const isLargeTablet = width >= 1024;

  return {
    isTablet,
    horizontalPadding: isLargeTablet ? 32 : isTablet ? 24 : 20,
    contentMaxWidth: isLargeTablet ? 980 : isTablet ? 760 : width,
    contentBottomPadding: isTablet ? 156 : 132,
    cardGridGap: isTablet ? 16 : 12,
  };
}
