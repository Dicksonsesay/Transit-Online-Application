import { Image, Text, View } from "@react-pdf/renderer";
import { pdfBaseStyles } from "@/lib/pdf/pdf-styles";

type PdfDocumentHeaderProps = {
  collegeName: string;
  tagline?: string;
  logoSrc?: string;
  title: string;
  subtitle?: string;
  compact?: boolean;
};

export default function PdfDocumentHeader({
  collegeName,
  tagline = "Transformation For Excellence",
  logoSrc,
  title,
  subtitle,
  compact = false,
}: PdfDocumentHeaderProps) {
  return (
    <View
      style={
        compact
          ? { ...pdfBaseStyles.headerRow, marginBottom: 8, paddingBottom: 8 }
          : pdfBaseStyles.headerRow
      }
    >
      <View style={pdfBaseStyles.headerLeft}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: compact ? 6 : 10 }}>
          {logoSrc ? (
            <Image src={logoSrc} style={compact ? pdfBaseStyles.logoCompact : pdfBaseStyles.logo} />
          ) : null}
          <View style={{ flex: 1 }}>
            <Text style={compact ? pdfBaseStyles.collegeNameCompact : pdfBaseStyles.collegeName}>
              {collegeName}
            </Text>
            <Text style={pdfBaseStyles.collegeTagline}>{tagline}</Text>
          </View>
        </View>
      </View>
      <View style={pdfBaseStyles.headerRight}>
        <Text style={compact ? pdfBaseStyles.docTitleCompact : pdfBaseStyles.docTitle}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={pdfBaseStyles.docMeta}>{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
}
