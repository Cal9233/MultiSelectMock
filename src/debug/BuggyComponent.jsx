// BuggyComponent.jsx
import React, { useState, useEffect, useMemo } from 'react';

const BuggyComponent = ({ parentData }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clicked, setClicked] = useState(false);


    // Bug 3: Race condition in fetch
    const fetchData = async () => {
        setLoading(true);
        try {
            const response1 = fetch('api/data1');
            const response2 = fetch('api/data2');
            
            const [data1, data2] = await Promise.all([response1, response2]);

            const extractData1 = data1.json();
            const extractData2 = data2.json();

            const [completeData1, completeData2] = await Promise.all([extractData1, extractData2]);
            setData([...completeData1, ...completeData2]);
        } catch (err) {
            setError(err);
        }
            setLoading(false);
    };


    // Bug 1: Problematic useEffect
    // Will run everytime component is re-rendered
    useEffect(() => {
        fetchData();
    }, []);

    // Bug 2: Memory leak in subscription
    // Need to unmount the mounted setInterval
    useEffect(() => {
        const interval = setInterval(() => {
            console.log('Checking for updates...');
            fetchData();
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Bug 4: Event handler binding issue
    const handleClick = () => {
        setClicked(prev => !prev);
    }

    // Bug 5: Performance issue with expensive calculation
    const calculateTotal = useMemo(() => {
        console.log('Calculating...');
        return parentData.reduce((sum, item) => (sum + item.value), 0);
    }, [parentData]);

    return (
        <div>
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
        
        <button onClick={handleClick}>
            Click me
        </button>

        <div>
            Total: {calculateTotal()}
        </div>

        <ul>
            {data.map(item => (
                <li>{item.name}</li>
            ))}
        </ul>
        </div>
    );
};

export default BuggyComponent;