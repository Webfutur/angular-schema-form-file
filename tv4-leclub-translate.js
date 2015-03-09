(function (global) {
	var lang = {
		INVALID_TYPE: "Type non valide: {type} (type attendu : {expected})",
		ENUM_MISMATCH: "Acune valeur de l'énumération (enum) ne correspond à : {value}",
		ANY_OF_MISSING: "Les données ne correspondent à aucun schéma de \"anyOf\"",
		ONE_OF_MISSING: "Les données ne correspondent à aucun schéma de \"oneOf\"",
		ONE_OF_MULTIPLE: "Les données sont valides plus d'un schéma de \"oneOf\": index {index1} et {index2}",
		NOT_PASSED: "Les données correspondent au schéma de \"not\"",
		// Numeric errors
		NUMBER_MULTIPLE_OF: "La valeur {value} n'est pas un multiple de {multipleOf}",
		NUMBER_MINIMUM: "La valeur {value} est inférieure au minimum {minimum}",
		NUMBER_MINIMUM_EXCLUSIVE: "La valeur {value} est inférieure ou égale au minimum {minimum}",
		NUMBER_MAXIMUM: "La valeur {value} est supérieure au maximum {maximum}",
		NUMBER_MAXIMUM_EXCLUSIVE: "La valeur {value} est supérieure ou égale au maximum {maximum}",
		// String errors
		STRING_LENGTH_SHORT: "La chaîne (string) est trop courte ({length} caractères), minimum {minimum}",
		STRING_LENGTH_LONG: "La chaîne (string) est trop longue ({length} caractères), maximum {maximum}",
		STRING_PATTERN: "La chaîne (string) ne correspond pas au pattern: {pattern}",
		// Object errors
		OBJECT_PROPERTIES_MINIMUM: "Trop peu de propriétés sont définies ({propertyCount}), minimum {minimum}",
		OBJECT_PROPERTIES_MAXIMUM: "Trop de propriétés sont définies ({propertyCount}), maximum {maximum}",
		OBJECT_REQUIRED: "Propriété manquante : {key}",
		OBJECT_ADDITIONAL_PROPERTIES: "Propriétés supplémentaires non autorisées",
		OBJECT_DEPENDENCY_KEY: "Échec de dépendance - La propriété doit exister: {missing} (dûe à la propriété: {key})",
		// Array errors
		ARRAY_LENGTH_SHORT: "Il manque des éléments au tableau ({length}), minimum {minimum}",
		ARRAY_LENGTH_LONG: "Il y a trop d'éléments dans le tableau ({length}), maximum {maximum}",
		ARRAY_UNIQUE: "Les éléments du tableau ne sont pas uniques (Index {match1} et {match2})",
		ARRAY_ADDITIONAL_ITEMS: "Les éléments supplémentaires dans le tableau ne sont pas autorisés.",
		// Format errors
		FORMAT_CUSTOM: "Échec de la validation de format ({message})",
		KEYWORD_CUSTOM: "Échec mot clé (keyword): {key} ({message})",
		// Schema structure
		CIRCULAR_REFERENCE: "Référence circulaire $refs: {urls}",
		// Non-standard validation options
		UNKNOWN_PROPERTY: "Propriété inconnue (absente du schéma)",
        // File field
        ALLOWED_EXTENSIONS_ERROR: "Extension non autorisée. Les extensions autorisées sont {allowedExtensions}.",
        MAX_SIZE_ERROR: "Fichier trop volumineux. La taille maximale autorisée est {maxSize}."
        
	};

	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['../tv4'], function(tv4) {
			tv4.addLanguage('fr-FR', lang);
			return tv4;
		});
	} else if (typeof module !== 'undefined' && module.exports){
		// CommonJS. Define export.
		var tv4 = require('../tv4');
		tv4.addLanguage('fr-FR', lang);
		module.exports = tv4;
	} else {
		// Browser globals
		global.tv4.addLanguage('fr-FR', lang);
	}
})(this);
