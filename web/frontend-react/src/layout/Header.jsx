import React, { Fragment, useState } from 'react';

//NPM Packages
import { Menu, Transition } from '@headlessui/react';
import { UserIcon } from '@heroicons/react/24/solid';
import { useHistory, useLocation } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

//Static Files
import Logo from '../assets/imgs/KG-logo.png';

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { addKeyword, removeKeyword } from '../redux/search/SearchSlice';

//Components
import Badge from '../components/Badge';
import OutsideClick from '../components/OutsideClick';

//Services And Helper
import { Search } from '../services/services.search';
import { convertName } from '../helper/helper';


function Header() {

    const history = useHistory();

    const [isFocus, setIsFocus] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [keywordsToRender, setKeywordsToRender] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [timeOutId, setTimeOutId] = useState(null);

    const selectedKeywords = useSelector((state) => state.search.selectedKeywords);
    const dispatch = useDispatch();

    const { pathname } = useLocation();

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

    const showKeywords = (reverse) => {
        let clonedKeywords = Object.assign([], selectedKeywords);
        let reversedKeywords = clonedKeywords.reverse();
        let data = [];
        let length = clonedKeywords.length;
        if (length >= 1 && length < 5) {
            for (let i = 0; i <= length - 1; i++) {
                if (reverse) {
                    data.push(reversedKeywords[i])
                } else {
                    data.push(clonedKeywords[i])
                }
            }
        } else {
            for (let i = 0; i <= 3; i++) {
                if (reverse) {
                    data.push(reversedKeywords[i])
                } else {
                    data.push(clonedKeywords[i])
                }
            }
        }
        return data.map((keyword, index) => {
            return (
                <div key={index}>
                    <Badge exactCharCouts={true} item={keyword} handleUnSelect={handleUnSelect} />
                </div>
            )
        })
    }

    return (
        <nav className='sticky top-0 z-20 w-full bg-white py-2 px-4 mx:px-8 space-x-4 md:space-x-0 shadow flex h-16 items-start justify-between'>
            <div className='flex items-center space-x-0 md:space-x-4'>
                <img onClick={() => history.push('/')} className='w-12 h-auto md:w-12 md:h-12 cursor-pointer' src={Logo} alt='KG Logo' />
                <p className='text-[2rem] text-blue-900 hidden md:inline-block'>KG</p>
            </div>
            {
                pathname !== '/' ? (
                    <div className='relative max-w-xs md:max-w-none w-full md:w-2/3 lg:w-2/5 text-base'>
                        <OutsideClick setShow={() => { setShow(false); setIsFocus(false) }}>
                            <>
                                <div className='relative border border-orange-100 bg-white py-1 px-2 shadow-md transition overflow-hidden mx-auto rounded-2xl flex items-start justify-between'>
                                    <div className='text-orange-100 px-2 absolute top-3'>
                                        <MagnifyingGlassIcon className='w-6 h-6' />
                                    </div>
                                    <div className='min-h-[2.5rem] flex items-center flex-wrap w-full ml-10'>
                                        {isFocus ? selectedKeywords.map((item, index) => <Badge key={index} item={item} handleUnSelect={handleUnSelect} />) : null}
                                        {!isFocus && selectedKeywords.length >= 1 && selectedKeywords.length < 5 ? showKeywords(false) : null}
                                        {!isFocus && selectedKeywords.length > 4 ?
                                            <React.Fragment>
                                                {showKeywords(true)}
                                                <p className='text-blue-900'>& {selectedKeywords.length - 4} more</p>
                                            </React.Fragment> : null
                                        }
                                        <input
                                            required
                                            value={keyword}
                                            onChange={handleChange}
                                            onFocus={() => setIsFocus(true)}
                                            type="text"
                                            placeholder='Example - PersonA, PersonB'
                                            className='border-none outline-none w-[2rem] grow mx-2'
                                        />
                                    </div>
                                </div>
                                <div className={`${(keyword === '' || !show) ? 'hidden' : 'block'} shadow-md w-full mx-auto my-2 rounded-md bg-white py-2 text-left max-h-40 overflow-y-auto absolute left-0 right-0`}>
                                    {loading && <p className='py-2 px-4'>Loading ...</p>}
                                    {error && <p className='py-2 px-4'>No Correspond Data</p>}
                                    {
                                        !loading && !error &&
                                        keywordsToRender.map((item, index) => <p onClick={() => {handleSelect(item); setKeyword('');}} key={index} className='py-2 px-4 hover:bg-slate-50 hover:cursor-pointer'>{item.displayName}</p>)
                                    }
                                </div>
                            </>
                        </OutsideClick>
                    </div>
                ) : null
            }
            <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="p-1 rounded-full border border-blue-900">
                    <UserIcon className='w-8 h-8 text-blue-900' />
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute text-base right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item className='px-4 py-2 cursor-pointer hover:bg-gray-100'>
                            <p>Profile</p>
                        </Menu.Item>
                        <Menu.Item className='px-4 py-2 cursor-pointer hover:bg-gray-100'>
                            <p>Settings</p>
                        </Menu.Item>
                        <Menu.Item className='px-4 py-2 cursor-pointer hover:bg-gray-100'>
                            <p>Sign Out</p>
                        </Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>
        </nav>
    )
}

export default Header;