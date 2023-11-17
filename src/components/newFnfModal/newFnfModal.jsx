import styles from './newFnfModal.module.css';
import Image from 'next/image';
import { useContainer } from 'unstated-next';
import DashboardData from '@/state/dashboard';
import Global from '@/state/global';
import { TabIds } from '@/constants/constants';
import { splitAddresses } from '@/utils/utils';



const NewFnfModal = ({ isUpdateFnfClicked }) => {

        const {
            handleOverlayClicked, 
            closeModal, 
            handleSubmit, 
            handleInputChange, 
            sendData, 
            handleFnfUpdateAction, 
            addFnfState} = useContainer(DashboardData);

            const { allocations } = useContainer(Global);
            const listOfFnfAddresses = splitAddresses(allocations.fnfAddresses)

  return (
    <>
        {isUpdateFnfClicked && (
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
                            <label htmlFor="fnfAddresses">Input the addresses of your friends and family</label>
                            <textarea
                                required
                                value={sendData.fnfAddresses}
                                onChange={handleInputChange}
                                name="fnfAddresses"
                                rows="4"
                                cols="50"
                                placeholder="Enter the addresses of your family and friends separated by a comma"
                            /> 
                        </div>                    
                        <button onClick={handleFnfUpdateAction}>{addFnfState}</button>
                    </form>
                </div>
            </div>
        )}
    </>
  )
    
  
}

export default NewFnfModal;