import styles from './sendModal.module.css';
import Image from 'next/image';
import { useContainer } from 'unstated-next';
import DashboardData from '@/state/dashboard';
import Global from '@/state/global';

const MiscTab = ({ 
    handleOverlayClicked, 
    closeModal, 
    handleSubmit, 
    handleInputChange, 
    sendData, 
    handleSendAction, 
    sendState }) => {
 return (
    <div className={styles.overlay} onClick={handleOverlayClicked}>
        <div className={styles.modal}>
            <div className={styles.closeBox} onClick={closeModal}>
                <Image 
                    src="/close-circle.svg"
                    width={40}
                    height={40}
                    alt="Split wallet"
                    className={styles.closeModalImage}
                />
            </div>

            <form onSubmit={handleSubmit} className={styles.sendForm}>
                <div className={styles.labelAndInput}>
                    <label htmlFor="address">Input the address you want to send money to</label>
                    <input
                        required
                        type="text"
                        id="address"
                        name="address"
                        value={sendData.address}
                        onChange={handleInputChange}
                    />
                </div>                     
                <div className={styles.labelAndInput}>
                    <label htmlFor="amount">Input the amount</label>
                    <input
                        required
                        type="number"
                        id="amount"
                        name="amount"
                        value={sendData.amount}
                        onChange={handleInputChange}
                    />
                </div>
                <button onClick={handleSendAction}>{sendState}</button>
            </form>
        </div>
    </div>
 )
}

const FnFTab = ({ 
    handleOverlayClicked, 
    closeModal, 
    handleSubmit, 
    handleInputChange, 
    sendData, 
    handleSendAction, 
    sendState }) => {
 return (
    <div className={styles.overlay} onClick={handleOverlayClicked}>
        <div className={styles.modal}>
            <div className={styles.closeBox} onClick={closeModal}>
                <Image 
                    src="/close-circle.svg"
                    width={40}
                    height={40}
                    alt="Split wallet"
                    className={styles.closeModalImage}
                />
            </div>

            <form onSubmit={handleSubmit} className={styles.sendForm}>
                <label htmlFor="selectedOption">Select your Family and Friend Address</label>
                <select name='selectedOption' value={sendData.selectedOption} onChange={handleInputChange}>
                    <option value="option1">0x79d899379844d35a1a1f5d51d3185dd821f44dc1</option>
                    <option value="option2">0x79d899379844d35a1a1f5d51d3185dd821f44dc1</option>
                    <option value="option3">0x79d899379844d35a1a1f5d51d3185dd821f44dc1</option>
                </select>                    
                <div className={styles.labelAndInput}>
                    <label htmlFor="amount">Input the amount</label>
                    <input
                        required
                        type="number"
                        id="amount"
                        name="amount"
                        value={sendData.amount}
                        onChange={handleInputChange}
                    />
                </div>
                <button onClick={handleSendAction}>{sendState}</button>
            </form>
        </div>
    </div>
 )
}




const SendModal = ({ isSendClicked, tabId }) => {

        const {
            handleOverlayClicked, 
            closeModal, 
            handleSubmit, 
            handleInputChange, 
            sendData, 
            handleSendAction, 
            sendState} = useContainer(DashboardData);

            const { allocations } = useContainer(Global);

            console.log(allocations.fnfAddresses)

            const properties = {
                handleOverlayClicked: handleOverlayClicked,
                closeModal: closeModal,
                handleSubmit: handleSubmit,
                handleInputChange: handleInputChange,
                sendData: sendData,
                handleSendAction: handleSendAction,
                sendState: sendState
            }

            const tabs = [   <FnFTab {...properties}/>,  <MiscTab {...properties}/>   ];

  return (isSendClicked && tabs[tabId])
}

export default SendModal;