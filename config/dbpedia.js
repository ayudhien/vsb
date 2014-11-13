'use strict';

angular.module('GSB.config')
    .config(function (globalConfig) {
        globalConfig.name = 'DBPEDIA_CONFIG';
        globalConfig.propertyTypeByRange['http://dbpedia.org/ontology/'] = 'OBJECT_PROPERTY';
        globalConfig.prefixes = _.merge(globalConfig.prefixes,{
            'category': 'http://dbpedia.org/resource/Category:',
            'dbpedia': 'http://dbpedia.org/resource/',
            'dbpedia-owl': 'http://dbpedia.org/ontology/',
            'dbpprop': 'http://dbpedia.org/property/',
            'units': 'http://dbpedia.org/units/',
            'yago': 'http://dbpedia.org/class/yago/'
        });
        globalConfig.defaultGraphURIs = ['http://dbpedia.org'];
        globalConfig.baseURL = 'http://dbpedia.org/sparql';
        globalConfig.resultURL = globalConfig.baseURL;
    });