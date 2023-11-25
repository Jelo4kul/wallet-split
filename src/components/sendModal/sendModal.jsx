import styles from './sendModal.module.css';
import Image from 'next/image';
import { useContainer } from 'unstated-next';
import DashboardData from '@/state/dashboard';
import Global from '@/state/global';
import { SendStates, TabIds } from '@/constants/constants';
import { splitAddresses } from '@/utils/utils';
import Spinner from '../spinner/spinner';

const MiscTab = ({ 
    handleOverlayClicked, 
    closeModal, 
    handleSubmit, 
    handleInputChange, 
    sendData, 
    handleSendAction, 
    sendState,
    setSendState }) => {


    if(sendState == SendStates.SENT) {
        closeModal();
        setSendState(SendStates.NOTSENT);
    }

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
                <button onClick={() => handleSendAction(TabIds.misc)}>{sendState == SendStates.SENDING ? <Spinner /> : sendState}</button>
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
    fnfAddresses, 
    setSendState }) => {

       if(sendState == SendStates.SENT) {
           closeModal();
           setSendState(SendStates.NOTSENT);
       }

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
                    {fnfAddresses.map((address, index) => (
                         <option key={index} value={`0x${address}`}>{`0x${address}`}</option>
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
                <button onClick={() => handleSendAction(TabIds.fnf)}>{sendState == SendStates.SENDING ? <Spinner /> : sendState}</button>
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
            sendState,
            setSendState} = useContainer(DashboardData);

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
                fnfAddresses: listOfFnfAddresses,
                setSendState: setSendState
            }

            const tabs = [   <FnFTab key={TabIds.fnf} {...properties}/>,  <MiscTab key={TabIds.misc} {...properties}/>   ];

  return (isSendClicked && tabs[tabId])
}

export default SendModal;