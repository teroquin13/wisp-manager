import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  section: { margin: 10, padding: 10, flexGrow: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, borderTop: '1px solid #ccc', paddingTop: 10, fontWeight: 'bold' }
});

interface InvoicePDFProps {
  invoiceId: string;
  customerName: string;
  amount: number;
  dueDate: string;
  planName: string;
}

export const InvoicePDF = ({ invoiceId, customerName, amount, dueDate, planName }: InvoicePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>WISP Manager - Factura de Servicio</Text>
      
      <View style={styles.section}>
        <View style={styles.row}>
          <Text>Cliente:</Text>
          <Text>{customerName}</Text>
        </View>
        <View style={styles.row}>
          <Text>Factura N°:</Text>
          <Text>{invoiceId}</Text>
        </View>
        <View style={styles.row}>
          <Text>Vencimiento:</Text>
          <Text>{dueDate}</Text>
        </View>
      </View>

      <View style={[styles.section, { borderTop: '1px solid #000', marginTop: 10 }]}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>Conceptos de Cobro:</Text>
        <View style={styles.row}>
          <Text>Servicio de Internet ({planName})</Text>
          <Text>${amount}</Text>
        </View>
        
        <View style={styles.totalRow}>
          <Text>TOTAL A PAGAR</Text>
          <Text>${amount}</Text>
        </View>
      </View>
    </Page>
  </Document>
);
