##
##  rooksubset.r
##
##  3/3/15
##

subset.app <- function(env){

    production<-FALSE     ## Toggle:  TRUE - Production, FALSE - Local Development
    warning<-FALSE

    print ('----- subset.app ----')
    if(production){
        sink(file = stderr(), type = "output")
    }
    request <- Request$new(env)
    response <- Response$new(headers = list( "Access-Control-Allow-Origin"="*"))

    valid <- jsonlite::validate(request$POST()$solaJSON)
    print(valid)
    if(!valid) {
        warning <- TRUE
        result <- list(warning="The request is not valid json. Check for special characters.")
    }

    if(!warning) {
        everything <- jsonlite::fromJSON(request$POST()$solaJSON)
         # print("value of Everything")
          #print(everything)
    }

    print(class(everything$callHistory))

    print('-- subset 1')

    if(!warning){
        mysessionid <- everything$zsessionid
        mylogfile<-logFile(mysessionid,production)
        if(mysessionid==""){
            warning <- TRUE
            result <- list(warning="No session id.")
        }
    }

    if(!warning){
        if(production){
            mydata <- readData(sessionid=mysessionid,logfile=mylogfile)
        }else{
            print ('rooksubset.R -- updated read path');
            #mydata <- read.delim("../data/session_affinity_scores_un_67_02132013-cow.tab")
            mydata <- read.delim("../static/data/fearonLaitin.tsv")
            #mydata <- read.delim("../data/QualOfGovt.tsv")
        }
	}

  print('-- subset 2')

    if(!warning){
		myvars <- everything$zvars
        if(is.null(myvars)){
            warning<-TRUE
            result<-list(warning="Problem with variables.")
        }
	}
  print('-- subset 3')


    if(!warning){
        mysubset <- parseSubset(everything$zsubset)
        if(is.null(mysubset)){
            warning <- TRUE
            result <- list(warning="Problem with subset.")
        }
    }
    print('-- subset 4')

    if(!warning){
        myplot <- everything$zplot
        if(is.null(myplot)){
            warning <- TRUE
            result <- list(warning="Problem with zplot.")
        }
    }
    print('-- subset 5')


    if(!warning){
        typeStuff <- everything$typeStuff
        if(!is.list(typeStuff) | (is.null(typeStuff$varnamesTypes) | is.null(typeStuff$interval) | is.null(typeStuff$numchar) | is.null(typeStuff$nature) | is.null(typeStuff$binary))){
            warning<-TRUE
            result<-list(warning="typeStuff is not a list or one of the necessary elements---varnames, interval, numchar, nature, binary---is null.")
        }
    }

    print('-- subset 6')

    if(!warning){
        history <- everything$callHistory
        if(is.null(history)){
            warning<-TRUE
            result<-list(warning="callHistory is null.")
        }
    }

    #print(dim(mydata))
    #print(dim(usedata))
    print('-- subset 7')

    # this tryCatch is not fully tested.
    tryCatch(
    {

        ## 1. prepare mydata so that it is identical to the representation of the data in TwoRavens
        mydata <- executeHistory(history=history, data=mydata)

        ## 2. perform current subset and out appropriate metadata
        usedata <- subsetData(data=mydata, sub=mysubset, varnames=myvars, plot=myplot)

        call <- ""
        for(i in 1:length(myvars)) {
            if(mysubset[[i]][1]=="" | is.na(mysubset[[i]][1])) {next}
            else {
                if(call != "") {call <- paste(call, ", ", sep="")}
                if(myplot[i]=="continuous") {
                    call <- paste(call, myvars[i], "[", mysubset[[i]][1], ":", mysubset[[i]][2], "]", sep="")
                } else if(myplot[i]=="bar") {
                    call <- paste(call, myvars[i], "[", paste(mysubset[[i]], collapse=","), "]", sep="")
                }
            }
        }

      #  print("rohit types")
       # print(typeStuff)
        # send preprocess new usedata and receive url with location
        print('-- subset 7a')
        purl <- pCall(data=usedata, production, sessionid=mysessionid, types=typeStuff)
        print('-- subset 7b')

        result <- jsonlite:::toJSON(list(url=purl, call=call))
        print('-- subset 7c')
    },
    error=function(err){
       print('-- subset 8')
        warning <<- TRUE
        result <- list(warning=paste("Subset error: ", err))
        result<-jsonlite:::toJSON(result)
        assign("result", result, envir=globalenv())
    })
    print('-- subset 9')

    #result <- toJSON(sumstats)
    print(result)
    print('-- subset 10')
    if(production){
        sink()
    }
    print('-- subset 11')
    response$write(result)
    response$finish()
}
