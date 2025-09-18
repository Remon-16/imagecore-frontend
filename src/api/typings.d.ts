declare namespace API {
  type aiChatStreamParams = {
    chatRequest: ChatRequest
  }

  type BaseResponseBoolean = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseChatAllHisResponse = {
    code?: number
    data?: ChatAllHisResponse
    message?: string
  }

  type BaseResponseChatHisResponse = {
    code?: number
    data?: ChatHisResponse
    message?: string
  }

  type BaseResponseCreateOutPaintingTaskResponse = {
    code?: number
    data?: CreateOutPaintingTaskResponse
    message?: string
  }

  type BaseResponseGeText2ImageTaskResponse = {
    code?: number
    data?: GeText2ImageTaskResponse
    message?: string
  }

  type BaseResponseGetOutPaintingTaskResponse = {
    code?: number
    data?: GetOutPaintingTaskResponse
    message?: string
  }

  type BaseResponseInteger = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponseListChatHisListVo = {
    code?: number
    data?: ChatHisListVo[]
    message?: string
  }

  type BaseResponseListImageSearchResult = {
    code?: number
    data?: ImageSearchResult[]
    message?: string
  }

  type BaseResponseListPictureVO = {
    code?: number
    data?: PictureVO[]
    message?: string
  }

  type BaseResponseListSpace = {
    code?: number
    data?: Space[]
    message?: string
  }

  type BaseResponseListSpaceCategoryAnalyzeResponse = {
    code?: number
    data?: SpaceCategoryAnalyzeResponse[]
    message?: string
  }

  type BaseResponseListSpaceLevel = {
    code?: number
    data?: SpaceLevel[]
    message?: string
  }

  type BaseResponseListSpaceSizeAnalyzeResponse = {
    code?: number
    data?: SpaceSizeAnalyzeResponse[]
    message?: string
  }

  type BaseResponseListSpaceTagAnalyzeResponse = {
    code?: number
    data?: SpaceTagAnalyzeResponse[]
    message?: string
  }

  type BaseResponseListSpaceUserAnalyzeResponse = {
    code?: number
    data?: SpaceUserAnalyzeResponse[]
    message?: string
  }

  type BaseResponseListSpaceUserVO = {
    code?: number
    data?: SpaceUserVO[]
    message?: string
  }

  type BaseResponseLoginUserVO = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type BaseResponseLong = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponsePageChatHisVo = {
    code?: number
    data?: PageChatHisVo
    message?: string
  }

  type BaseResponsePageMessageVo = {
    code?: number
    data?: PageMessageVo
    message?: string
  }

  type BaseResponsePagePicture = {
    code?: number
    data?: PagePicture
    message?: string
  }

  type BaseResponsePagePictureCommentRootVo = {
    code?: number
    data?: PagePictureCommentRootVo
    message?: string
  }

  type BaseResponsePagePictureCommentVo = {
    code?: number
    data?: PagePictureCommentVo
    message?: string
  }

  type BaseResponsePagePictureVO = {
    code?: number
    data?: PagePictureVO
    message?: string
  }

  type BaseResponsePageSpace = {
    code?: number
    data?: PageSpace
    message?: string
  }

  type BaseResponsePageSpaceVO = {
    code?: number
    data?: PageSpaceVO
    message?: string
  }

  type BaseResponsePageUserVO = {
    code?: number
    data?: PageUserVO
    message?: string
  }

  type BaseResponsePicture = {
    code?: number
    data?: Picture
    message?: string
  }

  type BaseResponsePictureCommentVo = {
    code?: number
    data?: PictureCommentVo
    message?: string
  }

  type BaseResponsePictureTagCategory = {
    code?: number
    data?: PictureTagCategory
    message?: string
  }

  type BaseResponsePictureVO = {
    code?: number
    data?: PictureVO
    message?: string
  }

  type BaseResponseSpace = {
    code?: number
    data?: Space
    message?: string
  }

  type BaseResponseSpaceUsageAnalyzeResponse = {
    code?: number
    data?: SpaceUsageAnalyzeResponse
    message?: string
  }

  type BaseResponseSpaceUser = {
    code?: number
    data?: SpaceUser
    message?: string
  }

  type BaseResponseSpaceVO = {
    code?: number
    data?: SpaceVO
    message?: string
  }

  type BaseResponseString = {
    code?: number
    data?: string
    message?: string
  }

  type BaseResponseText2ImageTaskResponse = {
    code?: number
    data?: Text2ImageTaskResponse
    message?: string
  }

  type BaseResponseUser = {
    code?: number
    data?: User
    message?: string
  }

  type BaseResponseUserVO = {
    code?: number
    data?: UserVO
    message?: string
  }

  type ChatAllHisResponse = {
    chatHisList?: ChatHisListVo[]
  }

  type ChatHisListVo = {
    chatHisList?: PageChatHisVo
    chatId?: string
    lastCreateTime?: string
  }

  type ChatHisRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    userId?: number
    chatId?: string
    chatType?: string
    lastChatTime?: string
  }

  type ChatHisResponse = {
    chatHisList?: ChatHisVo[]
    lastCreateTime?: string
  }

  type ChatHisVo = {
    messageId?: number
    chatId?: string
    chatContent?: string
    chatType?: string
    createTime?: string
  }

  type ChatRequest = {
    userId?: number
    chatId?: string
    userMessage?: string
    chatType?: string
    lastTimestamp?: string
  }

  type CreateOutPaintingTaskResponse = {
    output?: Output
    code?: string
    message?: string
    requestId?: string
  }

  type CreatePictureOutPaintingTaskRequest = {
    pictureId?: number
    parameters?: Parameters
  }

  type DeleteRequest = {
    id?: number
  }

  type doAIChatParams = {
    chatRequest: ChatRequest
  }

  type doChatParams = {
    chatRequest: ChatRequest
  }

  type doChatStreamParams = {
    chatRequest: ChatRequest
  }

  type DoThumbRequest = {
    pictureId?: number
  }

  type GeText2ImageTaskResponse = {
    requestId?: string
    output?: Output
  }

  type getNewChatIdParams = {
    chatType: string
  }

  type GetOutPaintingTaskResponse = {
    requestId?: string
    output?: Output
  }

  type getPictureByIdParams = {
    id: number
  }

  type getPictureOutPaintingTaskParams = {
    taskId: string
  }

  type getPictureVOByIdParams = {
    id: number
  }

  type getSpaceByIdParams = {
    id: number
  }

  type getSpaceVOByIdParams = {
    id: number
  }

  type getText2ImageTaskParams = {
    taskId: string
  }

  type getUserByIdParams = {
    id: number
  }

  type getUserVOByIdParams = {
    id: number
  }

  type ImageSearchResult = {
    thumbUrl?: string
    fromUrl?: string
  }

  type Input = {
    prompt?: string
    negativePrompt?: string
    refImg?: string
  }

  type LoginUserVO = {
    id?: number
    userAccount?: string
    token?: string
    userName?: string
    userAvatar?: string
    userProfile?: string
    userScore?: number
    vipExpiry?: string
    vipType?: string
    userRole?: string
    editTime?: string
    createTime?: string
    updateTime?: string
  }

  type MessageVo = {
    id?: number
    userId?: number
    content?: string
    messageType?: string
    messageState?: string
    senderId?: number
    pictureId?: number
    commentId?: number
    pictureCommentVo?: PictureCommentVo
    createTime?: string
  }

  type OrderItem = {
    column?: string
    asc?: boolean
  }

  type Output = {
    taskId?: string
    taskStatus?: string
  }

  type PageChatHisVo = {
    records?: ChatHisVo[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageChatHisVo
    searchCount?: PageChatHisVo
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PageMessageVo = {
    records?: MessageVo[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageMessageVo
    searchCount?: PageMessageVo
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PagePicture = {
    records?: Picture[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PagePicture
    searchCount?: PagePicture
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PagePictureCommentRootVo = {
    records?: PictureCommentRootVo[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PagePictureCommentRootVo
    searchCount?: PagePictureCommentRootVo
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PagePictureCommentVo = {
    records?: PictureCommentVo[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PagePictureCommentVo
    searchCount?: PagePictureCommentVo
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PagePictureVO = {
    records?: PictureVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PagePictureVO
    searchCount?: PagePictureVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PageSpace = {
    records?: Space[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageSpace
    searchCount?: PageSpace
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PageSpaceVO = {
    records?: SpaceVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageSpaceVO
    searchCount?: PageSpaceVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PageUserVO = {
    records?: UserVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageUserVO
    searchCount?: PageUserVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type Parameters = {
    style?: string
    size?: string
    n?: number
    refMode?: string
    refStrength?: number
  }

  type Picture = {
    id?: number
    url?: string
    thumbnailUrl?: string
    name?: string
    introduction?: string
    category?: string
    tags?: string
    picSize?: number
    picWidth?: number
    picHeight?: number
    picScale?: number
    picFormat?: string
    picColor?: string
    userId?: number
    spaceId?: number
    thumbCount?: number
    reviewStatus?: number
    reviewMessage?: string
    reviewerId?: number
    reviewTime?: string
    createTime?: string
    editTime?: string
    updateTime?: string
    isDelete?: number
  }

  type PictureCommentQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    pictureId?: number
    targetId?: number
  }

  type PictureCommentRequest = {
    id?: number
    userId?: number
    pictureId?: number
    targetId?: number
    secondTargetId?: number
    content?: string
  }

  type PictureCommentRootVo = {
    id?: number
    userId?: number
    pictureId?: number
    content?: string
    createTime?: string
    user?: UserVO
    pictureCommentVos?: PagePictureCommentVo
  }

  type PictureCommentVo = {
    id?: number
    userId?: number
    pictureId?: number
    targetId?: number
    secondTargetId?: number
    targetUserId?: number
    targetUserName?: string
    content?: string
    user?: UserVO
    createTime?: string
  }

  type PictureEditByBatchRequest = {
    pictureIdList?: number[]
    spaceId?: number
    category?: string
    tags?: string[]
    nameRule?: string
  }

  type PictureEditRequest = {
    id?: number
    name?: string
    introduction?: string
    category?: string
    tags?: string[]
  }

  type PictureQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    id?: number
    name?: string
    introduction?: string
    category?: string
    tags?: string[]
    picSize?: number
    picWidth?: number
    picHeight?: number
    picScale?: number
    picFormat?: string
    searchText?: string
    userId?: number
    reviewStatus?: number
    reviewMessage?: string
    reviewerId?: number
    reviewTime?: string
    spaceId?: number
    nullSpaceId?: boolean
    startEditTime?: string
    endEditTime?: string
  }

  type PictureReviewRequest = {
    id?: number
    reviewStatus?: number
    reviewMessage?: string
  }

  type PictureTagCategory = {
    tagList?: string[]
    categoryList?: string[]
  }

  type PictureUpdateRequest = {
    id?: number
    name?: string
    introduction?: string
    category?: string
    tags?: string[]
  }

  type PictureUploadByBatchRequest = {
    searchText?: string
    count?: number
    namePrefix?: string
  }

  type PictureUploadRequest = {
    id?: number
    fileUrl?: string
    picName?: string
    spaceId?: number
  }

  type PictureVO = {
    id?: number
    url?: string
    thumbnailUrl?: string
    name?: string
    introduction?: string
    tags?: string[]
    category?: string
    picSize?: number
    picWidth?: number
    picHeight?: number
    picScale?: number
    picFormat?: string
    picColor?: string
    userId?: number
    spaceId?: number
    createTime?: string
    editTime?: string
    updateTime?: string
    user?: UserVO
    hasThumb?: boolean
    thumbCount?: number
    space?: Space
    permissionList?: string[]
  }

  type SearchPictureByColorRequest = {
    picColor?: string
    spaceId?: number
  }

  type SearchPictureByPictureRequest = {
    pictureId?: number
  }

  type ServerSentEventString = true

  type Space = {
    id?: number
    spaceName?: string
    spaceLevel?: number
    spaceType?: number
    maxSize?: number
    maxCount?: number
    totalSize?: number
    totalCount?: number
    userId?: number
    createTime?: string
    editTime?: string
    updateTime?: string
    isDelete?: number
  }

  type SpaceAddRequest = {
    spaceName?: string
    spaceLevel?: number
    spaceType?: number
  }

  type SpaceCategoryAnalyzeRequest = {
    spaceId?: number
    queryPublic?: boolean
    queryAll?: boolean
  }

  type SpaceCategoryAnalyzeResponse = {
    category?: string
    count?: number
    totalSize?: number
  }

  type SpaceEditRequest = {
    id?: number
    spaceName?: string
  }

  type SpaceLevel = {
    value?: number
    text?: string
    maxCount?: number
    maxSize?: number
  }

  type SpaceQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    id?: number
    userId?: number
    spaceName?: string
    spaceLevel?: number
    spaceType?: number
  }

  type SpaceRankAnalyzeRequest = {
    topN?: number
  }

  type SpaceSizeAnalyzeRequest = {
    spaceId?: number
    queryPublic?: boolean
    queryAll?: boolean
  }

  type SpaceSizeAnalyzeResponse = {
    sizeRange?: string
    count?: number
  }

  type SpaceTagAnalyzeRequest = {
    spaceId?: number
    queryPublic?: boolean
    queryAll?: boolean
  }

  type SpaceTagAnalyzeResponse = {
    tag?: string
    count?: number
  }

  type SpaceUpdateRequest = {
    id?: number
    spaceName?: string
    spaceLevel?: number
    maxSize?: number
    maxCount?: number
  }

  type SpaceUsageAnalyzeRequest = {
    spaceId?: number
    queryPublic?: boolean
    queryAll?: boolean
  }

  type SpaceUsageAnalyzeResponse = {
    usedSize?: number
    maxSize?: number
    sizeUsageRatio?: number
    usedCount?: number
    maxCount?: number
    countUsageRatio?: number
  }

  type SpaceUser = {
    id?: number
    spaceId?: number
    userId?: number
    spaceRole?: string
    createTime?: string
    updateTime?: string
  }

  type SpaceUserAddRequest = {
    spaceId?: number
    userId?: number
    spaceRole?: string
  }

  type SpaceUserAnalyzeRequest = {
    spaceId?: number
    queryPublic?: boolean
    queryAll?: boolean
    userId?: number
    timeDimension?: string
  }

  type SpaceUserAnalyzeResponse = {
    period?: string
    count?: number
  }

  type SpaceUserEditRequest = {
    id?: number
    spaceRole?: string
  }

  type SpaceUserQueryRequest = {
    id?: number
    spaceId?: number
    userId?: number
    spaceRole?: string
  }

  type SpaceUserVO = {
    id?: number
    spaceId?: number
    userId?: number
    spaceRole?: string
    createTime?: string
    updateTime?: string
    user?: UserVO
    space?: SpaceVO
  }

  type SpaceVO = {
    id?: number
    spaceName?: string
    spaceLevel?: number
    spaceType?: number
    maxSize?: number
    maxCount?: number
    totalSize?: number
    totalCount?: number
    userId?: number
    createTime?: string
    editTime?: string
    updateTime?: string
    user?: UserVO
    permissionList?: string[]
  }

  type testDownloadFileParams = {
    filepath: string
  }

  type Text2ImageTaskRequest = {
    model?: string
    input?: Input
    parameters?: Parameters
  }

  type Text2ImageTaskResponse = {
    output?: Output
    code?: string
    message?: string
    requestId?: string
  }

  type updateUserAvatarParams = {
    userUpdateInfoRequest: UserUpdateInfoRequest
  }

  type updateUserInfoParams = {
    userUpdateInfoRequest: UserUpdateInfoRequest
  }

  type uploadPictureParams = {
    pictureUploadRequest: PictureUploadRequest
  }

  type User = {
    id?: number
    userAccount?: string
    userPassword?: string
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
    editTime?: string
    createTime?: string
    updateTime?: string
    userScore?: number
    vipExpiry?: string
    vipType?: string
    isDelete?: number
    admin?: boolean
  }

  type UserAddRequest = {
    userName?: string
    userAccount?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
  }

  type UserLoginRequest = {
    userAccount?: string
    userPassword?: string
  }

  type UserMessageRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    userId?: number
    messageId?: number
    messageType?: string
    messageStatus?: string
  }

  type UserQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    id?: number
    userName?: string
    userAccount?: string
    userProfile?: string
    userRole?: string
  }

  type UserRegisterRequest = {
    userAccount?: string
    userPassword?: string
    checkPassword?: string
  }

  type UserUpdateInfoRequest = {
    id?: number
    userName?: string
    userAvatar?: string
    userProfile?: string
    vipExpiry?: string
    vipType?: string
  }

  type UserUpdateRequest = {
    id?: number
    userName?: string
    userAvatar?: string
    userProfile?: string
    vipExpiry?: string
    vipType?: string
    userRole?: string
  }

  type UserVO = {
    id?: number
    userAccount?: string
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
    createTime?: string
  }
}
