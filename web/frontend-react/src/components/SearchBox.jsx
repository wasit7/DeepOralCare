import React, { useState } from 'react';

//NPM Packages
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useHistory } from 'react-router-dom';

//Services And Helper
import { Search } from '../services/services.search';
import { convertName } from '../helper/helper';

//Components
import Badge from './Badge';

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { addKeyword, removeKeyword } from '../redux/search/SearchSlice';

//Hooks
import OutsideClick from '../hooks/OutsideClick';

function SearchBox() {
    const history = useHistory();

    const selectedKeywords = useSelector((state) => state.search.selectedKeywords);
    const dispatch = useDispatch();

    const [isFocus, setIsFocus] = useState(false);
    const [keyword, setKeyword] = useState('');

    const [timeOutId, setTimeOutId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [show, setShow] = useState(false);

    const [keywordsToRender, setKeywordsToRender] = useState([]);

    const handleSearch = (e) => {
        e.preventDefault();
        history.push('/Search');
    }


    const callApi = async (value) => {
        const res = await Search(value);
        setLoading(false);
        if (res.data.length > 0) {
            let data = res.data.map(item => ({ ...item, displayName: convertName(item.name) }));
            setKeywordsToRender(data);
        } else {
            setError(true);
        }
    }

    const handleChange = (e) => {

        let value = e.target.value.toLocaleLowerCase();
        setError(false);
        if (value === '') {
            setLoading(false);
            setKeyword('');
            clearTimeout(timeOutId);
        } else {
            setShow(true);
            setLoading(true);
            setKeyword(value);

            // we already have a previous timeout, clear it.
            if (timeOutId) {
                clearTimeout(timeOutId);
            }

            // Set the timeout again
            setTimeOutId(setTimeout(() => {
                callApi(value);
            }, 1000))
        }
    }

    const handleSelect = (selectedItem) => {
        dispatch(addKeyword(selectedItem));
        let data = keywordsToRender.filter(item => item.id !== selectedItem.id);
        setKeywordsToRender([...data]);
    }

    const handleUnSelect = (unselectedItem) => {
        dispatch(removeKeyword(unselectedItem));
        setKeywordsToRender([...keywordsToRender, unselectedItem]);
    }

    return (
        <form onSubmit={handleSearch}>
            <div className='relative text-base'>
                <div className={`border border-orange-100 ${isFocus ? 'shadow-md' : 'shadow-sm'} ${selectedKeywords.length > 0 ? 'rounded-2xl' : 'rounded-full'} transition w-full md:w-2/3 mx-auto p-2 flex items-center justify-between`}>
                    <div className={`text-orange-100 px-2 ${selectedKeywords.length > 0 ? 'hidden' : 'block'}`}>
                        <MagnifyingGlassIcon className='w-6 h-6' />
                    </div>
                    <div className='flex flex-wrap w-full'>
                        {
                            selectedKeywords.map((item, index) => <Badge key={index} item={item} handleUnSelect={handleUnSelect} />)
                        }
                        <input
                            required={keyword === '' && selectedKeywords.length === 0}
                            value={keyword}
                            onChange={handleChange}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            placeholder='Example - PersonA, PersonB'
                            type="text"
                            className='border-none outline-none grow mx-2'
                        />
                    </div>
                </div>
                <OutsideClick setShow={() => setShow(false)}>
                    <div className={`${(keyword === '' || !show) ? 'hidden' : 'block'} shadow-md w-full md:w-2/3 mx-auto my-2 rounded-md bg-white py-2 text-left max-h-40 overflow-y-auto absolute left-0 right-0`}>
                        {loading && <p className='py-2 px-4'>Loading ...</p>}
                        {error && <p className='py-2 px-4'>No Correspond Data</p>}
                        {
                            !loading && !error &&
                            keywordsToRender.map((item, index) => <p onClick={() => {handleSelect(item); setKeyword('');}} key={index} className='py-2 px-4 hover:bg-slate-50 hover:cursor-pointer'>{item.displayName}</p>)
                        }
                    </div>
                </OutsideClick>
                <button type='submit' className='mt-4 mx-auto border-none outline-none bg-orange-100 hover:bg-orange-400 transition text-white px-16 py-2 rounded-full'>ค้นหา</button>
            </div>
        </form>
    )
}

export default SearchBox