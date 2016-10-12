(function( M ){
  M.override( M.Element , {
    validateItem:function( order , empty , error , repeat , succ , ev, dom ){
      var me = this;
      if( order && (M.getEls( "."+ empty +", ."+ error +", ."+ repeat , dom ).length > 0) ){
        return false ;
      }
      var isRequired = this.attr("isRequired") ;
      var val = this.val();
      if(this.type != 'password') val = val.trim();
      function classOpHp ( resule , cls ){
        if( resule ){
          me.parent().removeClass(empty).removeClass(error).removeClass(repeat).removeClass(succ);
          me.parent().addClass( cls );
          return true;
        }else{
          me.parent().removeClass( cls );
        }
      }
      var repeatEl = this.attr( "repeat" );
      if( repeatEl ){
        var val = M.getEl( repeatEl ).val();
        if(this.type != 'password') val = val.trim();
        classOpHp( this.val() !== val , repeat );
      }
      var emptySta = classOpHp( ( isRequired && val.length == 0 ) , empty );
      if( emptySta ){ return false; }
      var rule = this.attr("rule");
      if( rule != null ){
        var result = true , i = 0 ;
        rule = rule.split("{$}")
        while( i < rule.length ){
          var subrule = new RegExp( rule[ i++ ] );
          if( !subrule.test(val) ){
            result = false ;
            classOpHp( true , error );
            break ;
          }
        }
        !!result && classOpHp( false , error );
      }
      var parent = this.parent();
      var args = [ empty , error , repeat ].join( " " ) ;
      if( !parent.hasClass( args ) ){
        parent.addClass(succ);
        if( !ev ){
          this.fire("afterValidate");
        }
      }else{
        parent.removeClass(succ);
      }
    },
    submit:function(){
      var me = this ;
      setTimeout(function(){
        me.dom.submit();
      },20)
    },
    validate:function( order , empty , error , repeat , succ ){
      order = order || false;
      empty = empty || "empty" ;
      error = error || "error" ;
      repeat = repeat || "repeat" ;
      succ = succ || "succ" ;
      if( this.dom.tagName.toUpperCase() == 'FORM' ){
        M.getEls(".item", this.dom ).doApply("addListener", "blur" , function( e ){
          this.validateItem( false , empty , error , repeat , succ ) ;
        }).doApply("addListener","focus",function(){
          var parent = this.parent();
          parent.removeClass( [ empty , error , repeat , succ ].join(" ") )
        });
        this.addListener("submit",function( e ){
          M.getEls(".item", this.dom ).doApply("validateItem" , order , empty , error , repeat , succ , true, this.dom );
          if( M.getEls( "."+ empty +", ."+ error +", ."+ repeat , this.dom ).length > 0 ){
            return false ;
          }
        });
      }
    }
  });
}( M ));
