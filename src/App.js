/* eslint-disable react/jsx-no-comment-textnodes */
import logo from './logo.svg';
import nobel from './noble.png';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import React, { useEffect, useState } from 'react';
// app หลักแสดงหน้าจอ
function App() {
  const [nobelPrizes, setNobelPrizes] = useState([]);
  const [filteredPrizes, setFilteredPrizes] = useState([]);
  const [selectedYear, setSelectedYear] = useState(''); // State for selected year

  useEffect(() => {
    fetch('https://api.nobelprize.org/2.1/nobelPrizes')
      .then(response => response.json())
      .then(data => {
        const { nobelPrizes } = data;
        setNobelPrizes(nobelPrizes);
        console.log('fetc data', nobelPrizes)
      })
      .catch(error => console.error(error));
  }, []);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    // คอยรับค่าเมื่อ เปลี่ยน year ตรง filter
  };

  const handleApplyFilter = () => {
    // เช็คว่ามีค่า selectedYearแล้วหรือไม่
    // สร้าง data มา 1 ตัวชื่อว่า filtered โดนเช็คจากเงื่อนไข awardYear = selectedYear
    if (selectedYear) {
      const filtered = nobelPrizes.filter(
        (prize) => prize.awardYear && prize.awardYear.toString() === selectedYear
      );
      setFilteredPrizes(filtered);
    } else {
      setFilteredPrizes(nobelPrizes);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>NobelPrizes Year: {selectedYear}</h2> {/* แสดงปีที่เลือกจาก filter */}
      </header>
      <div>
        <Row xs={1} md={3}>
          <Col>
            <FilterComponent
              nobelPrizes={nobelPrizes}
              selectedYear={selectedYear} // ส่งค่า selectedYear ในแบบ prop
              onYearChange={handleYearChange} // prop ตอนเปลี่ยนปี คศ ของ filter
              onApplyFilter={handleApplyFilter} // ทำงานเมื่อกด applyFilter
            />
          </Col>
          <Col>
            <NobelCard nobelPrizes={filteredPrizes} /* แสดงปีที่เลือกจาก filter *//> 
          </Col>
        </Row>
      </div>
    </div>
  );
}
// ส่วนของ filter เป็นการเลือกแบบ select ตามปี โดยget ปีปัจจุบันมากจาก getfullyear
const FilterComponent = ({ nobelPrizes, selectedYear, onYearChange, onApplyFilter }) => {
  const handleApplyFilter = () => {
    if (selectedYear) {
      const filtered = nobelPrizes.filter(
        (prize) => prize.awardYear && prize.awardYear.toString() === selectedYear
      );
      onApplyFilter(filtered);
    } else {
      onApplyFilter(nobelPrizes);
    }
  };

  return (
    <div className="container">
      <h1>Choose Filter here</h1>
      <select className="form-select" value={selectedYear} onChange={onYearChange}>
        <option value="">Select Year</option>
        {Array.from({ length: new Date().getFullYear() - 1900 }, (_, index) => (
          <option key={index} value={new Date().getFullYear() - index}>
            {new Date().getFullYear() - index}
          </option>
        ))}
      </select>
      <button className="btn btn-primary mt-3" onClick={handleApplyFilter}>
        Apply Filter
      </button>
    </div>
  );
};
function NobelCard({ nobelPrizes }) {
  // การคำนวณค่า prize amount ของปีนั้นๆที่เลือกทั้งหมดและนำมารวมกัน เป็น total
  const totalPrizeAmount = nobelPrizes.reduce((total, prize) => {
    return total + parseFloat(prize.prizeAmount || 0);
  }, 0);
  return (
    <div>
      {nobelPrizes.length > 0 ? (
        // ทำงานคล้าย v-for ที่วนเอาค่าใน data ที่เป็น array มาแสดงผลเป็นแต่ละ card
        nobelPrizes.map((prize, index) => (
          <Card key={index} style={{ width: '40rem', marginBottom: '1rem', paddingRight: '1rem' }} className="card">
            <Card.Body>
            <Card.Img variant="left" src={nobel} />
              <Card.Title>Category: {prize.categoryFullName.en}</Card.Title>
              <Card.Text>Years Award: {prize.awardYear}</Card.Text>
              <Card.Text>Price Amount: {prize.prizeAmount}</Card.Text>
              <Card.Text>Motivation: {prize.laureates[0].motivation.en}</Card.Text>
              <Button variant="primary">อ่านเพิ่มเติม</Button>
            </Card.Body>
          </Card>
        ))
      ) : (
        <div style={{ color: '#294783' }}><h1>No Data in this Year</h1></div>// หากปีนั้นๆไม่มี noble prizes ก็จะแสดงว่า No Data in this Year
      )}
       <div>
        <h3 style={{ color: '#294783' }}>Total Prize Amount: {totalPrizeAmount}</h3>
      </div>
    </div>// แสดงผลรวม prizesAmount (totalPrizeAmount)
  );
}



export default App;