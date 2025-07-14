import vision from '@google-cloud/vision';

const CREDENTIALS = JSON.parse(JSON.stringify({
  "type": "service_account",
  "project_id": "smart-quasar-424904-p9",
  "private_key_id": "bc024d81542381c39c5df8211cdc1da75bb0687d",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDkjEPWpqj5jKev\njp0+1ozxhJ3TnJO3K2IBFsNsHrFYt0LkOj6Im1tckTYfFKmS3182eZfy8pWQkPxh\nB6yYS/zBIbUx0kmgcE04GTm7cw6m4EBLb0t7IstjViPF9GLI0lvJhFMBfkZD13lA\nP48RaVZOk+AooCf5sYT1PrqRNqBc83ohmijviKrP9IAYh/GYam6NNrwqhZvdZaj/\ndXMKB7UFJfON/LgxxcEwua2wbEG1lZS9eH0nAWBV/hJy1ObMwIzsVCtH1UmpTLML\nY4EI1FbwJmyPNE1pWQlX5Nu59jI9gRXIGBiLjejEAF+eUwvkLlz8/gps3ko1Uq3P\n1tbdSzqHAgMBAAECggEAG37mgHH/fTpXSC8rqs4sGbhfNoCtYsmE2mWvMBhHNMmj\ncgqx0ESEis/rh3S4a/OUpFyfk7pslP5kZpYCRTZLG78e6fYHJpasK5YZVHxkpF3x\nTkH+/jry5ioMVrnukoOASG+zfsf+0xWewESFRU57dCulOa3+8TLSsKCR2HuOcnAc\nKbqkPWEJjjbiXBdaZ9Gt9gPQsCYCKYHvrRynd5f/O8pNVaqn4QweSxwie7SaQFwP\nDEGIdaoNzYggnQvAOzDyDVjokzcud8SqLUIGxoOrUOxWKgpdguDNO58DBw9BXUd4\ncSdjknIbKUhifMf8X+UkhEtgyXY9smbixr0HoBsNyQKBgQD1ey5B+Ni7oveH6G5U\nmIbx1Z0Owe5lSFIOlF7+O7+jJLhZv3K2rTTAkr/QFicEKJKDBCyzKj/qKYRJl7Ef\nmpXXaTyRcljv+65Y21reJWLh0QwS8Q5EkCJNhe+l94WdO8i8YXoY5XbbTaUJLbun\nKu6lBXIQh4P1nVsAUOggULY4+QKBgQDuV1V7yJa9mp70KZ2ZUzNiO4teSImhlSeQ\nxgWih63p6h5wGgd/CRZ4b4gkCFY5Fm0M4DDl2vi1UpzQTU3p39525x0O5WMZkfu7\n+Ec8J+vvaYAKFupKVID4S7UxaAmcHcMjTci4XnVKKpK8oT8njmwKlfce1Zaeqp48\nmQ9VFvlvfwKBgDfVTo4exVzYEijNStre3kJ+7Xv/y/MpYdCDGqAEgu/eWDfBfZvj\nBU6PkiUIBNPDTp+SAYC2qVbfHoGGiPjBNjeKbgY+1c+vlNYM/jvskPL/kxlzzmT1\ny3eKcRl0lOVQRbXjDdw/xKrYnCLcTgQVlbXe6TStPexNX/dQb5t6ABgxAoGAL5+F\ntikbbaFCl5jlI6jLQJqTO3CVB5NNB5F5uMMRjga4tD+PNePz+HaYplKAIAIKIiN9\nwb/iKCDssnZv1gZkZi/Bz6MoDQjtWt6+JRf4/ap/6gQwJlACQRqnhsq5+Na9kgVN\n0QEWwI4HKeeyPc4oamkSqreU0/lVitguhxsDFjMCgYB/t7ljKbGh3kweDVgmiBBI\ndV3lnwp9csRzAH8Zj5D89Ahaub5vmZ8GsMSlXzpX5jjdjEJDGpvJtvFzkCUHnI1H\n4Np1UmEzXdUL+FOwmg4++AcKvGF7ArOevDcLiopc8S1k6OG4BBmQ50+mdLYdo6mv\nr/Qw+qe4idQOVy4otlBsTA==\n-----END PRIVATE KEY-----\n",
  "client_email": "fyp-images@smart-quasar-424904-p9.iam.gserviceaccount.com",
  "client_id": "105410035868239196227",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/fyp-images%40smart-quasar-424904-p9.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}));

const CONFIG = {
  credentials: {
    private_key: CREDENTIALS.private_key,
    client_email: CREDENTIALS.client_email
  }
};

const client = new vision.ImageAnnotatorClient(CONFIG);

const detectLandmark = async (file_path) => {
  try {
    const [result] = await client.labelDetection(file_path);
    const labels = result.labelAnnotations;

    if (labels.length > 0) {
      console.log('Label detected:');
      labels.forEach(label => {
        console.log(label.description);
      });
      return labels.map(label => label.description);
    } else {
      console.log('No Label detected.');
      return [];
    }
  } catch (error) {
    console.error('Error detecting Label:', error);
    throw new Error('Error detecting Label');
  }
};

export default detectLandmark;


