import { useEffect, useReducer } from 'react'
import axios from 'axios'

import { skillReducer, initialState, actionTypes } from '../reducers/skillReducer'
import { requestStates } from '../constants'

export const useSkills = () => {
    const [state, dispatch] = useReducer(skillReducer, initialState)

    const fetchReposApi = () => {
        axios.get('https://api.github.com/users/tomoki1119/repos')
        .then((response) => {
            const languageList = response.data.map(res => res.language);
            const countedLanguageList = generateLanguageCountObj(languageList);
            dispatch({type:actionTypes.success, payload: {languageList: countedLanguageList}});
        })
        .catch(() => {
            dispatch({type:actionTypes.error});
        });
    }

    useEffect(() => {
        if (state.requestState !== requestStates.loading) {return;}
        fetchReposApi();
    }, [state.requestState]);

    useEffect(() => {
        dispatch({ type:actionTypes.fetch });
    }, []);

    const generateLanguageCountObj = (allLanguageList) => {
        const notNullLanguageList = allLanguageList.filter(language => language != null);
        const uniqueLanguageList = [...new Set(notNullLanguageList)];

        return uniqueLanguageList.map(item => {
            return {
                language: item,
                count: allLanguageList.filter(language => language === item).length
            }
        });
    };

    const DEFAULT_MAX_PERCENTAGE = 100;
    const LANGUAGE_COUNT_BASE = 10;

    const converseCountToPercentage = (languagecount) => {
        if (languagecount > LANGUAGE_COUNT_BASE) {return DEFAULT_MAX_PERCENTAGE;}
        return languagecount * DEFAULT_MAX_PERCENTAGE;
    }

    const sortedLanguageList = () => (
        state.languageList.sort((firstLang, nextLang) => nextLang.count -firstLang.count)
    )

    return [sortedLanguageList, state.requestState, converseCountToPercentage]
}