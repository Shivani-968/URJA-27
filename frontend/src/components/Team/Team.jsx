import React from 'react';
import './Team.css';
import Footer from '../Footer/Footer.jsx';

// Updated team data with one entry per person
const supercoreTeamData = [
    {
        post: 'Sports Secretary',
        name: 'Prakhar Anand',
        regNo: '2023UGMM015',
        image: 'prakharanand.jpg'
    },
    {
        post: 'General Secretary',
        name: 'Ankit Kumar Sharma',
        regNo: '2023UGMM011',
        image: 'ankitkumarsharma.jpg'
    },
    {
        post: 'General Secretary',
        name: 'Virender Singh',
        regNo: '2023UGMM009',
        image: 'virendersingh.jpg'
    },
    {
        post: 'Joint Alumni Secretary',
        name: 'Vivek Kumar Mahatha',
        regNo: '2024UGMM043',
        image: 'vivekkumar.jpg'
    },
    
    {
        post: 'Joint Secretary',
        name: 'Amarnath',
        regNo: '2024PGCSCA066',
        image: 'amarnath.jpg'
    },
    {
        post: 'Joint Secretary',
        name: 'Anshu Kumar',
        regNo: '2023UGME066',
        image: 'anshukumar.jpg'
    },
    {
        post: 'Event Head',
        name: 'Sai Prasad Das',
        regNo: '2023UGMM010',
        image: 'saiprasaddas.jpg'
    },
    {
        post: 'Event Head',
        name: 'Urvashi Rani',
        regNo: '2023UGME100',
        image: 'urvashirani.jpg'
    },
    {
        post: 'Executive Head',
        name: 'Deepak Kumar',
        regNo: '2023UGPI006',
        image: 'deepakkumar.jpg'
    },
    {
        post: 'Logistics Head',
        name: 'Shubham Kumar',
        regNo: '2023UGMM071',
        image: 'shubhamkumar.jpg'
    },
    {
        post: 'Planning & Development Head',
        name: 'Himanshu Teotia',
        regNo: '2023UGME108',
        image: 'himanshuteotia.jpg'
    },
    {
        post: 'Planning & Development Head',
        name: 'Rohit Kumar',
        regNo: '2023UGMM096',
        image: 'rohitkumar.jpg'
    },
    {
        post: 'Public Relations Head',
        name: 'Himanshu Teotia',
        regNo: '2023UGME108',
        image: 'himanshuteotia.jpg'
    },
    {
        post: 'Creative Head',
        name: 'Sarwar Ali',
        regNo: '2023UGEE055',
        image: 'sarwarali.jpg'
    },
    {
        post: 'Medical Head',
        name: 'Ishan Raj',
        regNo: '2023UGCM010',
        image: 'ishanraj.jpg'
    },
    {
        post: 'Corporate Affairs Head',
        name: 'Harsh Sharma',
        regNo: '2023UGME047',
        image: 'harshsharma.jpg'
    },
    {
        post: 'Corporate Affairs Head',
        name: 'Rathod Nandini',
        regNo: '2023UGCS079',
        image: 'nandinirathod.jpg'
    },
    {
        post: 'App & Web Head',
        name: 'Harshit Vashisth',
        regNo: '2023UGEC058',
        image: 'harshitvashisth.jpg'
    },
    {
        post: 'App & Web Head',
        name: 'Lokesh Maheshwari',
        regNo: '2023UGCS082',
        image: 'lokeshmaheshwari.jpg'
    },

];

function Team() {
    return (
        <>
            <div className="team-page-content">

                <h1 className="main-team-heading">
                    URJA'27 SUPERCORE
                </h1>

                <div className="team-cards-container">

                    {supercoreTeamData.map((member, index) => (

                        <div className="team-card" key={index}>

                            <div className="card-image-container">

                                <img
                                   src={`${import.meta.env.BASE_URL}supercore/${member.image}${['Urvashi Rani', 'Rathod Nandini', 'Sai Prasad Das'].includes(member.name) ? '?v=2' : ''}`}
                                    alt={member.name}
                                    className="member-image"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = `${import.meta.env.BASE_URL}supercore/priyanshu_dev.jpg`;
                                    }}
                                />

                                <div className="card-overlay"></div>

                            </div>

                            <div className="card-details">

                                <p className="card-post">
                                    {member.post}
                                </p>

                                <h2 className="card-name">
                                    {member.name}
                                </h2>

                                <p className="card-regno">
                                    {member.regNo}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

            <Footer />
        </>
    );
}

export default Team;