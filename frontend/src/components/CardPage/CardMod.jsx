import {React, useState} from "react";
import { Card, Button } from "react-bootstrap";
import "./IndianCardStyle.css"
function CardMod({ title, state, src, content, handleSubmit }) {
  const [about, setAbout] = useState(content.slice(0, 75));
  const [readMore, setReadMore] = useState(false);

  const handleRead = () => {
    if(readMore) {
      setAbout(content.slice(0, 75));
      setReadMore(false);
    } else {
      setAbout(content);
      setReadMore(true);
    }
  };

  return (
    <div>
      <Card style={{ width: "18rem" }}>
        <Card.Title style={{fontSize:"2rem"}}>{title}</Card.Title>
        <Card.Title style={{fontSize:"1.5rem"}} className="italic">{state}</Card.Title>
        <Card.Body className="card-body">
          <Card.Img style={{height:"200px"}} src={src} />
          <Card.Text>
            {about}
            <p style={{color: "#084298", cursor: "pointer"}} onClick={handleRead}><b>....read more</b></p>
          </Card.Text>
          <Button variant="primary" onClick={handleSubmit}>
            Explore More
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default CardMod;
