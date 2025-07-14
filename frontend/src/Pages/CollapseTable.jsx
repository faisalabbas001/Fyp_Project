import React from "react";
import Table from "react-bootstrap/Table";
import { Card, Flex } from "antd";
import Form from "react-bootstrap/Form";
import "./CollapseTable.css";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;
export default function CollapseTable() {
  return (
    <div className="table-main">
      <Card className="Lower-card">
        <center>
          <h3 style={{ color: "#306B42" }}>Weather Analysis</h3>
        </center>
        <Card className="upper-card">
          <Flex horizontal gap="large">
            <label className="mt-4" style={{ color: "#306B42" }}>
              Farm
            </label>
            <Form.Control
              type="text"
              placeholder="Search"
              className="input-field mt-3 mb-3"
              style={{border: "1px solid #306B42"}}
            />
            <label className="mt-4" style={{ color: "#306B42" }}>
              Date
            </label>
            <RangePicker className="mt-3 mb-3" style={{border: "1px solid #306B42"}}/>
          </Flex>
          <Table bordered> 
            <thead>
              <tr className="table-head">
                <th className="p-3">Weather</th>
                <th className="p-3">Temperature</th>
                <th className="p-3">Humidity</th>
                <th className="p-3">Pressure</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
              </tr>
            </tbody>
          </Table>
        </Card>
      </Card>
    </div>
  );
}
