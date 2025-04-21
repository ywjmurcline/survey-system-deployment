import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import '../../styles/qr-code.css';

const QRCode = ({ value }) => {
  return (
    <div className="qr-code-container">
      <div className="qr-code">
        <QRCodeSVG 
          value={value} 
          size={150}
          level="M"
          includeMargin={true}
          bgColor="#FFFFFF"
          fgColor="#000000"
        />
      </div>
      <div className="qr-instructions">
        Scan to join
      </div>
      <div className="join-url">
        {value}
      </div>
    </div>
  );
};

export default QRCode;