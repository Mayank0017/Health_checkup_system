import React, {useState} from 'react';
import axios from "axios";
import './uploadButton.css';
import {useAuth} from "../Context/Context";
import {useNavigate} from "react-router-dom"; // Assuming you've saved your SCSS styles in a CSS file named styles.css


function UploadComponent({fileType, onClose, purpose}) {
    const [fileName, setFileName] = useState('No file selected');
    const [uploading, setUploading] = useState(false);
    const [uploadtext, setUploadtext] = useState('Uploading...');
    const [error, setError] = useState('');
    const {checktoken} = useAuth();
    const navigate = useNavigate();

    const uploadFile = async (file) => {
        if (file) {
            if (fileType && !file.name.toLowerCase().endsWith(`.${fileType.toLowerCase()}`)) {
                setError(`Please select a ${fileType.toUpperCase()} file`);
                return;
            }

            // Clear error message
            setError('');

            // Convert file to base64 string
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64String = reader.result.split(',')[1];

                // Handle different purposes based on fileType
                try {
                    let response;
                    setUploading(true);

                    if (purpose === 'injury' || purpose === 'xray' || purpose === 'mri') {
                        // Post base64 string to server
                        setTimeout(() => {
                            setUploadtext('Analyzing...');
                        }, 3000);
                        response = await axios.post(`http://localhost:8080/${purpose}`, {data: base64String}, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}` // Include the JWT token in the Authorization header
                            }
                        });
                        console.log(response.data); // Log server response

                    } else if (purpose === 'report') {
                        // Post PDF file to server (assuming formData is available)
                        const formData = new FormData();
                        formData.append('file', file);
                        setTimeout(() => {
                            setUploadtext('Analyzing...');
                        }, 3000);
                        response = await axios.post(`http://localhost:8080/${purpose}`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                        });
                    }
                    setTimeout(() => {
                        setUploadtext('Sending Response...');
                    }, 6000);


                    // Update the file name and trigger upload
                    setFileName(file.name);

                    // Simulating upload delay with setTimeout
                    setTimeout(() => {
                        setUploading(false);
                        onClose();
                        checktoken(localStorage.getItem('token'));
                        navigate(`/records/${response.data.diagnosisId}`);
                    }, 10000);
                } catch (error) {
                    console.error('Error:', error);
                    setUploading(false);
                    setError('An error occurred while uploading the file.');
                }
            };
            reader.onerror = () => {
                setError('An error occurred while reading the file.');
            };
        }
    };

    return (
        <>
            {uploading && (
                <div className="doctor-reading-report">
                    <iframe
                        src="https://gifer.com/embed/7z3X"
                        width="500px"
                        height="300px"
                        frameBorder="5px"
                        className="giphy-embed"
                        allowFullScreen
                    />
                </div>
            )}
            <div className={`upload ${uploading ? 'uploading' : ''}`}>
                <div className="upload-info">
                    <svg
                        t="1581822650945"
                        className="clip"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="3250"
                        width="20"
                        height="20"
                    >
                        <path
                            d="M645.51621918 141.21142578c21.36236596 0 41.79528808 4.04901123 61.4025879 12.06298852a159.71594214 159.71594214 0 0 1 54.26367236 35.87255836c15.84503198 16.07739258 27.76959252 34.13726783 35.78356909 54.13513184 7.86071778 19.30572486 11.76635766 39.80291724 11.76635767 61.53607177 0 21.68371583-3.90563989 42.22045875-11.76635767 61.54101586-8.01397729 19.99291992-19.95831275 38.02807617-35.78356909 54.08569313l-301.39672877 302.0839231c-9.21038818 9.22027564-20.15112281 16.48278832-32.74310277 21.77270508-12.29040503 4.81036401-24.54125953 7.19329834-36.82177783 7.19329834-12.29040503 0-24.56103516-2.38293433-36.85638427-7.19329834-12.63647461-5.28991675-23.53271461-12.55737281-32.7381587-21.77270508-9.55151367-9.58117675-16.69042992-20.44775367-21.50573731-32.57995583-4.7856443-11.61804223-7.15869117-23.91339135-7.15869188-36.9255979 0-13.14074708 2.37304688-25.55474854 7.16363524-37.19256639 4.81036401-11.94927954 11.94927954-22.78619408 21.50079395-32.55029274l278.11614966-278.46221923c6.45172119-6.51104737 14.22344971-9.75421118 23.27563501-9.75421119 8.8692627 0 16.54705787 3.24316383 23.03338622 9.75421119 6.47644019 6.49127173 9.73937964 14.18389916 9.73937964 23.08282495 0 9.0521853-3.26293945 16.81896972-9.73937964 23.32012891L366.97489888 629.73773218c-6.32812477 6.2935183-9.48724342 14.08007836-9.48724415 23.30529736 0 9.06701684 3.15417457 16.75964356 9.48724414 23.08776904 6.80273414 6.50610328 14.55963111 9.75915528 23.26574683 9.75915527 8.67150855 0 16.43334961-3.253052 23.27563501-9.76409935l301.37695313-302.04931665c18.93988037-18.96459937 28.40734887-42.04742432 28.40734814-69.25836158 0-27.16149926-9.4674685-50.26409912-28.40734815-69.22869849-19.44415283-19.13269043-42.55664086-28.72375464-69.31274438-28.72375536-26.97363258 0-49.99218727 9.59106422-69.1001587 28.72375536L274.3370815 536.89227319a159.99774146 159.99774146 0 0 0-35.80828883 54.33288526c-8.0337522 19.65179443-12.04321289 40.2824707-12.04321289 61.79809618 0 21.20910645 4.00451661 41.81011963 12.04321289 61.79809547 8.17218018 20.34393287 20.10168481 38.36920166 35.80828883 54.08569312 16.225708 16.06256104 34.30535888 28.13049292 54.23400854 36.15930176 19.91381813 8.0337522 40.47033667 12.06793189 61.64978002 12.0679326 21.13989281 0 41.70135474-4.03417969 61.63000513-12.0679326 19.91876221-8.02386474 38.01818872-20.09674073 54.2241211-36.15435768l300.86773656-301.53515601c6.47644019-6.50115991 14.23828125-9.76904273 23.28057912-9.76904344 8.88903833 0 16.56188941 3.26293945 23.04821776 9.76904344 6.48632836 6.48632836 9.7245481 14.17895508 9.7245481 23.06799269 0 9.09667992-3.23822046 16.8535769-9.7245481 23.37451172L552.40379244 815.35449242c-22.00012231 22.01989722-47.32745362 38.88336158-75.986938 50.49151564C449.10209565 877.14270043 420.37834101 882.78857422 390.21592671 882.78857422c-30.01904297 0-58.74279761-5.64587378-86.20587183-16.94256616-28.6842041-11.60815406-54.00659203-28.47161842-76.00671362-50.49151564a226.19586182 226.19586182 0 0 1-50.13061524-75.90289354A226.86328125 226.86328125 0 0 1 160.9697104 653.04797364c0-30.08331323 5.62115479-58.88122559 16.90795899-86.38385035 11.40545654-28.37768578 28.11566138-53.75939917 50.13061523-76.15997313h0.24719287L530.14164643 189.20135474c15.69177247-15.731323 33.68737817-27.70037818 53.98681641-35.89727735C604.09666377 145.26043701 624.55430562 141.23120141 645.51127583 141.23120141V141.21142578z"
                            p-id="3251"
                        />
                    </svg>
                    <span className={`upload-filename ${fileName ? '' : 'inactive'} drop-text`}>{fileName}</span>
                </div>
                <input
                    type="file"
                    id="file"
                    style={{display: 'none'}} // Hide the input element
                    onChange={(e) => uploadFile(e.target.files[0])}
                />
                <button className="upload-button" onClick={() => document.getElementById('file').click()}>
                    <span className="upload-button-text">Choose file</span>
                </button>
                <div className="upload-hint">{uploadtext}</div>
                <div className="upload-progress"/>
                {/* Error message container */}
                {error && <div className="error-message">{error}</div>}
            </div>
        </>
    );
}

export default UploadComponent;
