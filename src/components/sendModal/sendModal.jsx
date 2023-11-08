import styles from './sendModal.module.css';
import Image from 'next/image';

const SendModal = ({ 
    isSendClicked, 
    handleOverlayClicked, 
    closeModal, 
    handleSubmit, 
    handleInputChange, 
    sendData, 
    handleSendAction, 
    sendState }) => {
  return (
      <>
           {isSendClicked && 
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
                        <p className={styles.sendEthLabel}>Send Eth to this Address</p>
                        <div className={styles.addressAndIcon}>
                            <Image 
                                src="/deposit.svg"
                                width={20}
                                height={20}
                                alt="Split wallet"
                            />
                        </div>
                        <form onSubmit={handleSubmit} className={styles.sendForm}>
                            <label htmlFor="send">Input the address you want to send money to</label>
                            <input
                                required
                                type="text"
                                id="address"
                                name="address"
                                value={sendData.address}
                                onChange={handleInputChange}
                            />
                             <label htmlFor="send">Input the amount</label>
                            <input
                                required
                                type="number"
                                id="amount"
                                name="amount"
                                value={sendData.amount}
                                onChange={handleInputChange}
                            />
                             <button onClick={handleSendAction}>{sendState}</button>
                        </form>
                    </div>
                </div>
        } 
  
      </>
  )
}

export default SendModal;