import {baseUrl, myUrl} from '../baseUrl';
import axios from 'axios';

export default api = {

  getCount : async (expertId) => {
    let formdata = new FormData();
    const data = {expertId};
    const keys = Object.keys(data);
    keys.map(key => formdata.append(key, data[key]));
    
    console.log(formdata);
    let apiUrl = baseUrl + 'DailyOperations/GetCount.php';
    
    return axios.post(apiUrl, 
      formdata
    );
  },

  getTasks : async (expertId) => {
    let formdata = new FormData();
    const data = {expertId};
    const keys = Object.keys(data);  
    keys.map(key => formdata.append(key, data[key]));
    let apiUrl = baseUrl + 'DailyOperations/GetTasks.php';
    
    const response = await axios.post(apiUrl, 
      formdata
    );

    console.log(apiUrl, response)
    return response
  },

  getOptions : async (termId, expertId) => {
    const data = {ID:termId, expertId:expertId};

    let apiUrl = baseUrl + 'DailyOperations/GetOptions.php';

    return await axios.get(apiUrl, {params: data});
  },

  getExactOptions : async (termId, expertId) => {
    const data = {ID:termId, expertId:expertId};

    let apiUrl = baseUrl + 'DailyOperations/GetExactOptions.php';

    return await axios.get(apiUrl, {params: data});
  },

  submitDecesion : async (expertId, termId, choice, comment) => {
    let formdata = new FormData();
    const data = {expertId, termId, choice, writtenComment: comment, voiceComment: ''};
    const keys = Object.keys(data);
    keys.map(key => formdata.append(key, data[key]));

    let apiUrl = baseUrl + 'DailyOperations/ProcessDecision.php';

    return await axios.post(apiUrl, 
      formdata
    );
  },

  submitDecesions : async (expertId, termId, choice, comment) => {
   
    const data = {expertId, termId, choice, writtenComment: comment, voiceComment: ''};

    let apiUrl = baseUrl + 'DailyOperations/ProcessDecisions.php';

    return await axios.get(apiUrl, 
      {params: data}
    );
  },

  submitExactDecesions : async (expertId, termId, choice, reason) => {
    const data = {expertId, termId, choice, reason};
    
    let apiUrl = baseUrl + 'DailyOperations/ProcessExactDecisions.php';

    return await axios.get(apiUrl, 
      {params: data}
    );
  },

  submitExactDecesionsNone : async (expertId, termId, reason) => {
    const data = {expertId, termId, reason};
    
    let apiUrl = baseUrl + 'DailyOperations/ProcessExactDecisionsNone.php';

    return await axios.get(apiUrl, 
      {params: data}
    );
  },

  submitNewTerm : async (expertId, termId, newTerm, newDefinition, pickerStructure, input3, input4, newExisting, input5, type1) => {
    let formdata = new FormData();

    const data = {expertId, termId, newTerm, definition: newDefinition, superclass: pickerStructure, sentence: input3, taxa: input4, newOrExisting: '1', comment: input5, type: '1' };

    const keys = Object.keys(data);  
    keys.map(key => formdata.append(key, data[key]));
    console.log("hello "+ formdata)
   // let apiUrl = myUrl + 'class';
    let apiUrl = 'https://conflictresolver.lusites.xyz/dev/DailyOperations/ProcessDisputedDecision.php';

    return await axios.post(apiUrl, formdata );
  },

  submitDisputedterm : async (user, ontology, term1, pickerStructure, decisionExperts, newDate) => {
    const data = {user, ontology, term:term1, classIRI:pickerStructure, decisionExperts, decisionDate:newDate};
    console.log(data);
  
    let apiUrl = myUrl + 'nrsynonym';

    return await axios.post(apiUrl, data );
  },

  getApproveOptions : async (termId, expertId) => {
    const data = {termId, expertId};

    let apiUrl = baseUrl + 'DailyOperations/GetApproveOptions.php';

    return await axios.get(apiUrl, {params: data});
  },

  setDefinition : async (termId, expertId, sentenceIds, definitionIds, comment) => {
    const data = { termId, expertId, sentenceIds, definitionIds, comment };

    let apiUrl = baseUrl + 'DailyOperations/SetDefinition.php';

    return await axios.get(apiUrl, {params: data});
  },

  addDefinition : async (termId, expertId, definition) => {
    const data = {termId, expertId, definition};

    let apiUrl = baseUrl + 'DailyOperations/AddDefinition.php';

    return await axios.get(apiUrl, {params: data});
  },

  removeDefinition : async (termId, expertId, id) => {
    const data = {termId, expertId, id};

    let apiUrl = baseUrl + 'DailyOperations/RemoveDefinition.php';

    return await axios.get(apiUrl, {params: data});
  },
  
  getAddTermOptions : async (termId, expertId) => {
    const data = {termId, expertId};
    console.log(termId);
    let apiUrl = baseUrl + 'DailyOperations/GetAddTermOptions.php';

    return await axios.get(apiUrl, {params: data});
  },

  solveAddTermConflict : async (termId, expertId, termType, subPartString, superPartString, alwaysHasPartString, alwaysPartOfString, maybePartOfString, subclassOf, experts, synonyms, comment) => {
    const data = { termId, expertId, termType, subPartString, superPartString, alwaysHasPartString, alwaysPartOfString, maybePartOfString, subclassOf, experts, synonyms, comment };
    
    let apiUrl = baseUrl + 'DailyOperations/SolveAddTermConflict.php';

    return await axios.get(apiUrl, {params: data});
  },

  declineTerm: async (termId, expertId, reason, alternativeTerm) => {
    const data = { termId, expertId, reason, alternativeTerm };
    
    let apiUrl = baseUrl + 'DailyOperations/DeclineTerm.php';

    return await axios.get(apiUrl, {params: data});
  },
 
  getDisputed: async (expertId) => {

    // let apiUrl = myUrl + 'dispute/all';
    const data = {expertId};

    let apiUrl = 'https://conflictresolver.lusites.xyz/dev/DailyOperations/GetDisputedDeprecations.php?expertId=66';
 
    return await axios.get(apiUrl ); 
  },
  
  getQualityItem: async () => {
    let apiUrl = myUrl + 'carex/getSubclasses?baseIri=http://biosemantics.arizona.edu/ontologies/carex&term=quality';

    return await axios.get(apiUrl);

   
  },
  getStructureItem: async () => {
    let apiUrl = myUrl + 'carex/getSubclasses?baseIri=http://biosemantics.arizona.edu/ontologies/carex&term=anatomical%20structure';

    return await axios.get(apiUrl);
  },

  
  getQuality : async () => {
    let apiUrl = 'http://shark.sbs.arizona.edu:8080/carex/getSubclasses?baseIri=http://biosemantics.arizona.edu/ontologies/carex&term=quality';

    return await axios.get(apiUrl);
   
  },

  getStructure : async () => {
    
    let apiUrl = 'http://shark.sbs.arizona.edu:8080/carex/getSubclasses?baseIri=http://biosemantics.arizona.edu/ontologies/carex&term=anatomical%20structure';
    
    return await axios.get(apiUrl);

  },
}