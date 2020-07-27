import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
} from '@react-pdf/renderer';
import {
  currencyFormatter_VND,
  datetimeFormatter,
} from '../../../../utils/formatter';
import Roboto from '../../../../assets/fonts/Roboto/Roboto-Regular.ttf';
import Modal from '../../../../components/modal/Modal';
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  DataTableCell,
} from '@david.kucsai/react-pdf-table';
Font.register({
  family: 'Roboto',
  src: Roboto,
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Roboto',
    justifyContent: 'space-evenly',
  },
  section: {
    display: 'flex',
    width: '50%',
    borderRight: '1px dotted black',
  },
  brand: {
    fontSize: 25,
    color: '#000000',
    marginTop: 20,
    alignSelf: 'center',
  },
  brand_sub: {
    fontSize: 12,
    alignSelf: 'center',
  },
  customer_box: {
    border: '1px solid black',
    padding: 10,
    margin: 10,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 12,
  },
  products_table: {
    fontSize: 14,
    margin: 10,
    marginLeft: 20,
    marginRight: 20,
  },
});

const PrintShip = (props) => {
  const data = props.shipment.products.map((el) => ({
    name: el._id.name,
    ship_qty: el.ship_qty,
    total: el.total,
  }));

  data.push({
    name: 'Tổng cộng',
    ship_qty: '',
    total: '=' + props.shipment.total,
  });

  const page = () => (
    <View style={styles.section}>
      <View>
        <Text style={styles.brand}>Thuỷ - chuyên hàng Úc</Text>
        <Text style={styles.brand_sub}>0937885993</Text>
        <Text style={styles.brand_sub}>www.facebook.com/th.chuyen.hang.uc</Text>
      </View>

      <View style={styles.customer_box}>
        <Text style={{ flex: 1, flexWrap: 'wrap' }}>
          Tên khách: {props.order?.customer.name}
        </Text>
        <Text>Số điện thoại: {props.order?.customer.phone}</Text>
        <Text style={{ flex: 1, flexWrap: 'wrap' }}>
          Địa chỉ: {props.order?.customer.address}
        </Text>
      </View>

      <View>
        <Text style={{ alignSelf: 'center' }}>
          {' '}
          Sản phẩm giao theo đợt - Ngày {datetimeFormatter(props.shipment.timestamp)}
        </Text>
      </View>

      <View style={styles.products_table}>
        <Table data={data}>
          <TableHeader>
            <TableCell style={{ padding: 5 }} weighting={0.7}>
              Sản phẩm
            </TableCell>
            <TableCell style={{ padding: 5 }} weighting={0.1}>
              SL
            </TableCell>
            <TableCell style={{ padding: 5 }} weighting={0.2}>
              Thành tiền
            </TableCell>
          </TableHeader>
          <TableBody>
            <DataTableCell
              style={{ padding: 5 }}
              getContent={(r) => r.name}
              weighting={0.7}
            />
            <DataTableCell
              style={{ padding: 5 }}
              getContent={(r) => r.ship_qty}
              weighting={0.1}
            />
            <DataTableCell
              style={{ padding: 5 }}
              getContent={(r) => {
                if (r.total[0] === '=')
                  return (
                    '=' +
                    currencyFormatter_VND(r.total.substring(1, r.total.length))
                  );
                else return currencyFormatter_VND(r.total);
              }}
              weighting={0.2}
            />
          </TableBody>
        </Table>
      </View>
    </View>
  );

  return (
    <Modal show={true} onHide={props.onHide} header={'Hoá đơn cho đợt hàng'}>
      <PDFViewer>
        <Document title={props.order._id} >
          <Page size="A4" style={styles.page} orientation="landscape">
            {page()}
            {page()}
          </Page>
        </Document>
      </PDFViewer>
    </Modal>
  );
};

export default PrintShip;
