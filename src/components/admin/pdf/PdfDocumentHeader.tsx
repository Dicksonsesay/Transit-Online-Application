import { Image, Text, View } from "@react-pdf/renderer";
import { pdfBaseStyles } from "@/lib/pdf/pdf-styles";

type PdfDocumentHeaderProps = {
  collegeName: string;
  tagline?: string;
  logoSrc?: string;
  title: string;
  subtitle?: string;
};

export default function PdfDocumentHeader({
  collegeName,
  tagline = "Transformation For Excellence",
  logoSrc,
  title,
  subtitle,
}: PdfDocumentHeaderProps) {
  return (
    <View style={pdfBaseStyles.headerRow}>
      <View style={pdfBaseStyles.headerLeft}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {logoSrc ? <Image src={logoSrc} style={pdfBaseStyles.logo} /> : null}
          <View style={{ flex: 1 }}>
            <Text style={pdfBaseStyles.collegeName}>{collegeName}</Text>
            <Text style={pdfBaseStyles.collegeTagline}>{tagline}</Text>
          </View>
        </View>
      </View>
      <View style={pdfBaseStyles.headerRight}>
        <Text style={pdfBaseStyles.docTitle}>{title}</Text>
        {subtitle ? <Text style={pdfBaseStyles.docMeta}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}
