import React, { useEffect, useState } from 'react';

//Components
import LeftSideBar from '../components/LeftSideBar';
import RightSideBar from '../components/RightSideBar';
import DisplayGraph from '../components/Graph';
import Loading from '../components/Loading';

//Services And Helper
import { EntityDetail, Relation } from '../services/services.search';
import { convertName, splitAndConvertName } from '../helper/helper';

//Redux
import { useSelector } from 'react-redux';

function SearchResult() {

	const [inputSearch, setInputSearch] = useState('');
	const [loading, setLoading] = useState(false);

	const selectedKeywords = useSelector((state) => state.search.selectedKeywords);

	const [relations, setRelations] = useState([]);
	const [entities, setEntities] = useState([]);
	const [entitiesToShow, setEntitiesToShow] = useState([]);
	const [entityDetail, setEntityDetail] = useState(null);


	const { openLeft, openRight } = useSelector((state) => state.layout);

	useEffect(() => {
		handleSearch();
	}, [])


	const handleSearch = async () => {
		setLoading(true);
		const ids = selectedKeywords.map(keyword => keyword.id);
		// let ids = ["/c/en/person", "/c/en/people", "/c/en/cat"];
		const res = await Relation({ ids });
		setLoading(false);
		if (res.data.relations) {
			let data = res.data.relations.map(item => ({ ...item, head: splitAndConvertName(item.head), tail: splitAndConvertName(item.tail), originalHead: item.head, originalTail: item.tail }));
			setRelations(data);
		}
		if (res.data.entitys) {
			let data = res.data.entitys.map(item => ({...item, displayName: convertName(item.name)}))
			setEntities(data);
			setEntitiesToShow(data);
		}
	}

	const handleEntitySearch = (value) => {
		setInputSearch(value);
		let data = entities.filter(entity => entity.name.includes(value));
		setEntitiesToShow(data);
	}

	const fetchEntityDetail = async (id) => {
		const res = await EntityDetail({ id })
		if (res.data) {
			setEntityDetail(res.data);
		}else{
			setEntityDetail(null);
		}
	}

	const showEntityDetail = () => {
		let keys = Object.keys(entityDetail.attribute);
		return keys.map((key, index) => <p key={index} className='text-base'>{key} {entityDetail.attribute[key]}</p>)
	}

	return (
		<section className='bg-slate-200 content-container flex'>
			<LeftSideBar
				inputSearch={inputSearch}
				handleEntitySearch={handleEntitySearch}
			>
				{
					entitiesToShow.map((item, index) => {
						let keys = Object.keys(item.attribute);
						return (
							<div key={index} className='px-8 py-4 space-y-2'>
								<p>{item.name}</p>
								{
									keys.map((key, index) => {
										return (
											<p key={index}>{key} {item.attribute[key]}</p>
										)
									})
								}
							</div>
						)
					})
				}

			</LeftSideBar>
			<div className={`${openLeft && openRight ? 'w-1/3 md:w-3/5' : (openLeft || openRight) ? 'w-2/3 md:w-4/5' : 'w-full'} bg-[#EEE] shadow duration-500`}>
				{
					loading ? <Loading /> : <DisplayGraph nodes={relations} fetchEntityDetail={fetchEntityDetail} />
				}
			</div>
			<RightSideBar>
				<div className='px-8 py-4 space-y-2'>
					<h2 className='text-[1.4rem]'>รายละเอียด</h2>
					{
						entityDetail !== null ? (
							<React.Fragment>
								<h3 className='text-base'>{entityDetail.name}</h3>
								{showEntityDetail()}
							</React.Fragment>
						) : null
					}
				</div>
			</RightSideBar>
		</section>
	)
}

export default SearchResult;