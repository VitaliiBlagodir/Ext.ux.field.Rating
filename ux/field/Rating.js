/**
 * @aside example ratingfield
 *
 * Show the rating stars
 *
 * {@link Ext.ux.field.Rating} class extends from {@link Ext.field.Field}
 *
 *
 * ## Example
 *
 *     @example miniphone preview
 *     var form = Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'ratingfield',
 *                 name : 'usefull',
 *                 label: 'Is it usefull?',
 *                 value: 5
 *             },{
 *                 xtype: 'ratingfield',
 *                 name : 'rating',
 *                 label: 'Display only',
 *                 editable: false
 *             },{
 *                 xtype: 'toolbar',
 *                 docked: 'bottom',
 *                 items: [
 *                     { xtype: 'spacer' },
 *                     {
 *                         text: 'Get Values',
 *                         handler: function() {
 *                             var form = Ext.ComponentQuery.query('formpanel')[0],
 *                                 values = form.getValues();
 *
 *                             Ext.Msg.alert(null,
 *                                 "Usefull: " + values.usefull +
 *                                 "<br />Rating: " + values.rating
 *                             );
 *                         }
 *                     },{
 *                         text: 'Togle Editable',
 *                         handler: function() {
 *                             var form = Ext.ComponentQuery.query('formpanel')[0],
 *                                 ratingfield = form.query('ratingfield')[1];
 *                             ratingfield.setEditable(!ratingfield.getEditable());
 *                             Ext.Msg.alert(null,ratingfield.getEditable()?'Editable:true':'Editable:false' );
 *                         }
 *                     },
 *                     { xtype: 'spacer' }
 *                 ]
 *             }
 *         ]
 *     });
 *
 *
 */

Ext.define('Ext.ux.field.Rating', {
    xtype: 'ratingfield',
    extend: 'Ext.field.Field',
    alternateClassName: 'Ext.form.Rating',
    
    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        cls: 'x-rating-field',
        
        //baseCls: Ext.baseCSSPrefix + 'field x-rating',
        
        /**
         * @cfg {Number} value
         * rating as inter between 0-5
         */
        value: 0,

        /**
         * @cfg {Boolean} editable
         * Is rating changeable
         */
        editable: true,

        /**
         * @cfg
         * @inheritdoc
         */
        name: 'rating',
        
        /**
         * @cfg
         * @private
         */
        clearIcon: false,

        /**
         * @cfg
         * @private
         */
        component: {
            hidden    : true,
            xtype   : 'input',
            type    : 'text',
            useMask : true
        }
    },
    
    getElementConfig: function() {
        var prefix = Ext.baseCSSPrefix;
        
        return {
            reference: 'element',
            className: 'x-container',
            children: [{
                reference: 'label',
                cls: prefix + 'form-label',
                children: [{
                    reference: 'labelspan',
                    tag: 'span'
                }]
            },{
                reference: 'innerElement',
                cls: prefix + 'component-outer',
                html:'&nbsp;'+
                '<div class="starContainer">'+
                    '<div class="left"></div>'+
                    '<div class="x-button x-button-action star star1"></div>'+
                    '<div class="center"></div>'+
                    '<div class="x-button x-button-action star star2"></div>'+
                    '<div class="center"></div>'+
                    '<div class="x-button x-button-action star star3"></div>'+
                    '<div class="center"></div>'+
                    '<div class="x-button x-button-action star star4"></div>'+
                    '<div class="center"></div>'+
                    '<div class="x-button x-button-action star star5"></div>'+
                    '<div class="right"></div>'+
                '</div>'+
                '<div class="starFakeContainer"></div>'
            }]
        };
    },
    
    initialize: function(){
        var me = this;
        
        me.callParent();
        
        me.on('painted', function(){
            me.starFakeContainer = me.innerElement.down('.starFakeContainer');
            me.star1     = me.innerElement.down('.star1');
            me.star2     = me.innerElement.down('.star2');
            me.star3     = me.innerElement.down('.star3');
            me.star4     = me.innerElement.down('.star4');
            me.star5     = me.innerElement.down('.star5');
            var value     = me.getValue();
            me.orignalValue = value;
            me.activateStars(value);
            
            me.setEditable(me.getEditable());
        });        
    },
    
    applyEditable: function(editable){
        var me = this;
        
        if(!me.starFakeContainer){
            return editable;
        }
        
        if(editable){
            me.starFakeContainer.on({
                touchstart: me.onTouchStartMove,
                touchmove: me.onTouchStartMove,
                touchend: me.onTouchEnd,
                scope: me            
            });
        }else{
            me.starFakeContainer.un({
                touchstart: me.onTouchStartMove,
                touchmove: me.onTouchStartMove,
                touchend: me.onTouchEnd,
                scope: me            
            });
        }
        
        return editable;
    },
    
    applyValue: function(value){
        var me = this;
        
        if(value<0){
            value =0;    
        }else if(value>5){
            value = 5;    
        }        
        me.activateStars(value);
        
        return value;
    },
    
    activateStars: function(rating){
        if(!this['star1']){
            return;    
        }
        for(var i=1; i<=5; i++){
            this['star'+i].removeCls('active');
        }
        for(var i=1; i<=rating; i++){
            this['star'+i].addCls('active');
        }
    },
    
    buildRating:function(delta){
        var width = this.starFakeContainer.getWidth();
    
        if(delta>=width){
            delta = width;
        }else if(delta<=0){
            delta = 0;
        }
        
        delta = delta/width*100;
        
        var onePart = ((width/12)/width*100);
        var rating = 0;
        
        if(delta>=(onePart*9)){
            rating = 5;
        }else if(delta>=(onePart*7)){
            rating = 4;
        }else if(delta>=(onePart*5)){
            rating = 3;
        }else if(delta>=(onePart*3)){
            rating = 2;
        }else if(delta>=onePart){
            rating = 1;
        }
        this.setValue(rating);
        
        return delta;
    },
    
    onTouchStartMove: function(a){
        var me = this,
            offsetLeft = me.innerElement.dom.offsetLeft || 0;
        
        me.buildRating(a.pageX-offsetLeft);
    },
    
    onTouchEnd: function(a){
        var me = this,
            value = me.getValue(),
            offsetLeft = me.innerElement.dom.offsetLeft || 0;
        
        me.buildRating(a.pageX-offsetLeft);
        
        if(me.orignalValue != value){
            me.orignalValue = value;
            me.fireEvent('change', this, value, me.orignalValue);
        }
    }
});