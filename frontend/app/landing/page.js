'use client';

import { useEffect, useState } from 'react'
import { useNavigation } from '../../utils/navigation';
import styles from '../../styles/Landing.module.css'; 
import MainComponent from '../../components/MainComponent'; 


export default function Home() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const { navigateToTextInput, navigateToFileInput, navigateToKetcher } = useNavigation();

    
    // Fetch data from the API
    useEffect(() => {
        const fetchLanding = async () => {
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL +'/api/landing')
            const data = await response.json()

            if ( response.ok ){
                setMessage(data.land);
                setLoading(false);
                console.log("Landing Successful")
            }
        }
        fetchLanding()
    }, []);

    return (
        <div className={styles.body}>
        <MainComponent />
          
          <div className={styles.content}>
            <h3 className={styles.heading3}>Select a way to begin generating your forcefield:</h3>
            <p><button onClick={navigateToTextInput} className={styles.link}>Input a SMILES structure text</button></p>
            <p><button onClick={navigateToFileInput} className={styles.link}>Input a structure file (*.mol, *.bgf, *.cif, *.xyz, *.pdb)</button></p>
            <p><button onClick={navigateToKetcher} className={styles.link}>Design a structure with GUI</button></p>
          </div>

        </div>
      );
}
