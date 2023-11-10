import styles from './sendModal.module.css';
import Image from 'next/image';
import { useContainer } from 'unstated-next';
import DashboardData from '@/state/dashboard';
import Global from '@/state/global';
import { TabIds } from '@/constants/constants';
import { splitAddresses } from '@/utils/utils';

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
                <button onClick={() => handleSendAction(TabIds.misc)}>{sendState}</button>
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
    sendState,
    fnfAddresses }) => {
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
                    <option value="">Choose an Address</option>
                    {fnfAddresses.map(address => (
                         <option value={`0x${address}`}>{`0x${address}`}</option>
                    ))}
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
                <button onClick={() => handleSendAction(TabIds.fnf)}>{sendState}</button>
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
            const listOfFnfAddresses = splitAddresses(allocations.fnfAddresses)

            const properties = {
                handleOverlayClicked: handleOverlayClicked,
                closeModal: closeModal,
                handleSubmit: handleSubmit,
                handleInputChange: handleInputChange,
                sendData: sendData,
                handleSendAction: handleSendAction,
                sendState: sendState,
                fnfAddresses: listOfFnfAddresses
            }

            const tabs = [   <FnFTab {...properties}/>,  <MiscTab {...properties}/>   ];

  return (isSendClicked && tabs[tabId])
}

export default SendModal;