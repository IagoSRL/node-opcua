/**
 <UADataType NodeId="i=296" BrowseName="Argument">
 <DisplayName>Argument</DisplayName>
 <Description>An argument for a method.</Description>
 <References>
 <Reference ReferenceType="HasSubtype" IsForward="false">i=22</Reference>
 </References>
 <Definition Name="Argument">
 <Field Name="Name" DataType="i=12">
 <Description>The name of the argument.</Description>
 </Field>
 <Field Name="DataType" DataType="i=17">
 <Description>The data type of the argument.</Description>
 </Field>
 <Field Name="ValueRank" DataType="i=6">
 <Description>Whether the argument is an array type and the rank of the array if it is.</Description>
 </Field>
 <Field Name="ArrayDimensions" DataType="i=7" ValueRank="1">
 <Description>The number of dimensions if the argument is an array type and one or more dimensions have a fixed length.</Description>
 </Field>
 <Field Name="Description" DataType="i=21">
 <Description>The description for the argument.</Description>
 </Field>
 </Definition>
 </UADataType>
 */
require("requirish")._(module);
var factories = require("lib/misc/factories");
var NodeId = require("lib/datamodel/nodeid").NodeId;
var makeNodeId = require("lib/datamodel/nodeid").makeNodeId;
var _ = require("underscore");
var assert = require("better-assert");

var _defaultTypeMap = require("lib/misc/factories_builtin_types")._defaultTypeMap;
var encode_NodeId = _defaultTypeMap.NodeId.encode;
var decode_NodeId = _defaultTypeMap.NodeId.decode;


function _dataType_encodeAsNodeId(dataType, stream) {

    var nodeId = dataType;
    if (!(dataType instanceof NodeId)) {
        console.log("xxxx dataType.value ", dataType.value);
        nodeId = makeNodeId(dataType.value, 0);
    }
    encode_NodeId(nodeId, stream);
}

function _dataType_decodeAsNodeId(stream) {
    var nodeId = decode_NodeId(stream);
    assert(_.isFinite(nodeId.value));
    return DataType.get(nodeId.value);
}
var DataType = require("lib/datamodel/variant").DataType;

factories.registerBuiltInType({
    name: "DataTypeAsNodeId",
    encode: _dataType_encodeAsNodeId,
    decode: _dataType_decodeAsNodeId,
    defaultValue: DataType.Null
});


// OPC Unified Architecture, Part 4 $7.1 page 106
var Argument_Schema = {
    name: "Argument",
    documentation: "An argument for a method.",
    fields: [
        {name: "name", fieldType: "String", documentation: "The name of the argument."},
        {name: "dataType", fieldType: "DataTypeAsNodeId", documentation: "The data type of the argument."},

    /**
     * valueRank (5.6.2 Variable NodeClass part 3)
     * This Attribute indicates whether the Value Attribute of the Variable is
     * an array and how many dimensions the array has.
     * It may have the following values:
     *    n > 1: the Value is an array with the specified number of dimensions.
     *    OneDimension        (1): The value is an array with one dimension.
     *    OneOrMoreDimensions (0): The value is an array with one or more dimensions.
     *    Scalar             (−1): The value is not an array.
     *    Any                (−2): The value can be a scalar or an array with any number of
     *                             dimensions.
     *   ScalarOrOneDimension(−3): The value can be a scalar or a one dimensional array.
     *
     *   NOTE: All DataTypes are considered to be scalar, even if they hav
     *   array-like semantics like ByteString and String.
     */
        {
            name: "valueRank",
            fieldType: "Int32",
            documentation: "Whether the argument is an array type and the rank of the array if it is."
        },

    /**
     * arrayDimensions:
     * This Attribute specifies the length of each dimension for an array
     * value. The Attribute is intended to describe the capability of the
     * Variable, not the current size.
     * The number of elements shall be equal to the value of the ValueRank
     * Attribute. Shall be null if ValueRank ≤0.
     * A value of 0 for an individual dimension indicates that the dimension
     * has a variable length.
     * For example, if a Variable is defined by the following C array:
     * Int32 myArray[346];
     * then this Variable’s DataType would point to an Int32, the Variable’s
     * ValueRank has the value 1 and the one entry having the value 346.
     */

        {
            name: "arrayDimensions",
            fieldType: "UInt32",
            documentation: "The number of dimensions if the argument is an array type and one or more dimensions have a fixed length."
        },
        {name: "description", fieldType: "LocalizedText", documentation: "The description for the argument."}

    ]
};
exports.Argument_Schema = Argument_Schema;