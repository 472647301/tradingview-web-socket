/// <reference types="jquery" />

/**
 * This is the generic type useful for declaring a nominal type,
 * which does not structurally matches with the base type and
 * the other types declared over the same base type
 *
 * Usage:
 * @example
 * type Index = Nominal<number, 'Index'>;
 * // let i: Index = 42; // this fails to compile
 * let i: Index = 42 as Index; // OK
 * @example
 * type TagName = Nominal<string, 'TagName'>;
 */
export declare type Nominal<T, Name extends string> = T & {
	[Symbol.species]: Name;
};
export declare const enum ConnectionStatus {
	Connected = 1,
	Connecting = 2,
	Disconnected = 3,
	Error = 4
}
export declare const enum NotificationType {
	Error = 0,
	Success = 1
}
export declare const enum OrderStatus {
	Canceled = 1,
	Filled = 2,
	Inactive = 3,
	Placing = 4,
	Rejected = 5,
	Working = 6
}
export declare const enum OrderStatusFilter {
	All = 0,
	Canceled = 1,
	Filled = 2,
	Inactive = 3,
	Rejected = 5,
	Working = 6
}
export declare const enum OrderTicketFocusControl {
	StopLoss = 1,
	StopPrice = 2,
	TakeProfit = 3
}
export declare const enum OrderType {
	Limit = 1,
	Market = 2,
	Stop = 3,
	StopLimit = 4
}
export declare const enum ParentType {
	Order = 1,
	Position = 2,
	Trade = 3
}
export declare const enum PriceScaleMode {
	Normal = 0,
	Log = 1,
	Percentage = 2,
	IndexedTo100 = 3
}
export declare const enum SeriesStyle {
	Bars = 0,
	Candles = 1,
	Line = 2,
	Area = 3,
	HeikenAshi = 8,
	HollowCandles = 9,
	Renko = 4,
	Kagi = 5,
	PointAndFigure = 6,
	LineBreak = 7
}
export declare const enum Side {
	Buy = 1,
	Sell = -1
}
export declare const widget: ChartingLibraryWidgetConstructor;
export declare function version(): string;
export declare type ActionMetaInfo = ActionDescriptionWithCallback | MenuSeparator;
export declare type AvailableSaveloadVersions = '1.0' | '1.1';
export declare type ChartActionId = 'chartProperties' | 'compareOrAdd' | 'scalesProperties' | 'tmzProperties' | 'paneObjectTree' | 'insertIndicator' | 'symbolSearch' | 'changeInterval' | 'timeScaleReset' | 'chartReset' | 'seriesHide' | 'studyHide' | 'lineToggleLock' | 'lineHide' | 'showLeftAxis' | 'showRightAxis' | 'scaleSeriesOnly' | 'drawingToolbarAction' | 'stayInDrawingModeAction' | 'hideAllMarks' | 'showCountdown' | 'showSeriesLastValue' | 'showSymbolLabelsAction' | 'showStudyLastValue' | 'showStudyPlotNamesAction' | 'undo' | 'redo' | 'paneRemoveAllStudiesDrawingTools';
export declare type Direction = 'buy' | 'sell';
export declare type DomeCallback = (data: DOMData) => void;
export declare type DrawingEventType = 'click' | 'move' | 'remove' | 'hide' | 'show';
export declare type EditObjectDialogObjectType = 'mainSeries' | 'drawing' | 'study' | 'other';
export declare type EmptyCallback = () => void;
export declare type EntityId = Nominal<string, 'EntityId'>;
export declare type ErrorCallback = (reason: string) => void;
export declare type FieldDescriptor = TimeFieldDescriptor | SeriesFieldDescriptor | StudyFieldDescriptor;
export declare type GetMarksCallback<T> = (marks: T[]) => void;
export declare type HistoryCallback = (bars: Bar[], meta: HistoryMetadata) => void;
export declare type IBasicDataFeed = IDatafeedChartApi & IExternalDatafeed;
export declare type InputFieldValidator = (value: any) => InputFieldValidatorResult;
export declare type InputFieldValidatorResult = PositiveBaseInputFieldValidatorResult | NegativeBaseInputFieldValidatorResult;
export declare type LanguageCode = 'ar' | 'zh' | 'cs' | 'da_DK' | 'nl_NL' | 'en' | 'et_EE' | 'fr' | 'de' | 'el' | 'he_IL' | 'hu_HU' | 'id_ID' | 'it' | 'ja' | 'ko' | 'fa' | 'pl' | 'pt' | 'ro' | 'ru' | 'sk_SK' | 'es' | 'sv' | 'th' | 'tr' | 'vi';
export declare type LayoutType = SingleChartLayoutType | MultipleChartsLayoutType;
export declare type MarkConstColors = 'red' | 'green' | 'blue' | 'yellow';
export declare type MultipleChartsLayoutType = '2h' | '2v' | '2-1' | '3s' | '3h' | '3v' | '4' | '6' | '8' | '1-2' | '3r' | '4h' | '4v' | '4s' | '1-3' | '2-2' | '1-4' | '5s' | '6c' | '8c';
export declare type OnReadyCallback = (configuration: DatafeedConfiguration) => void;
export declare type Order = OrderWithParent | PlacedOrder;
export declare type OrderDialogCustomField = TextWithCheckboxFieldMetaInfo | CustomComboBoxMetaInfo;
export declare type PineJS = any;
export declare type QuoteData = QuoteOkData | QuoteErrorData;
export declare type QuotesCallback = (data: QuoteData[]) => void;
export declare type ResolutionBackValues = 'D' | 'M';
export declare type ResolutionString = string;
export declare type ResolveCallback = (symbolInfo: LibrarySymbolInfo) => void;
export declare type RssNewsFeedItem = RssNewsFeedInfo | RssNewsFeedInfo[];
export declare type SearchSymbolsCallback = (items: SearchSymbolResultItem[]) => void;
export declare type SeriesFormat = 'price' | 'volume';
export declare type ServerTimeCallback = (serverTime: number) => void;
export declare type ShapePoint = StickedPoint | PricedPoint | TimePoint;
export declare type SingleChartLayoutType = 's';
export declare type StandardFormatterName = 'date' | 'default' | 'fixed' | 'formatQuantity' | 'formatPrice' | 'formatPriceForexSup' | 'integerSeparated' | 'localDate' | 'percentage' | 'pips' | 'profit' | 'side' | 'status' | 'symbol' | 'type' | 'unixTimeAgo';
export declare type StudyInputId = Nominal<string, 'StudyInputId'>;
export declare type StudyInputValue = string | number | boolean;
export declare type StudyOverrideValueType = string | number | boolean;
export declare type StudyPriceScale = 'left' | 'right' | 'no-scale' | 'as-series';
export declare type SubscribeBarsCallback = (bar: Bar) => void;
export declare type SupportedLineTools = 'text' | 'anchored_text' | 'note' | 'anchored_note' | 'double_curve' | 'arc' | 'icon' | 'arrow_up' | 'arrow_down' | 'arrow_left' | 'arrow_right' | 'price_label' | 'flag' | 'vertical_line' | 'horizontal_line' | 'cross_line' | 'horizontal_ray' | 'trend_line' | 'info_line' | 'trend_angle' | 'arrow' | 'ray' | 'extended' | 'parallel_channel' | 'disjoint_angle' | 'flat_bottom' | 'pitchfork' | 'schiff_pitchfork_modified' | 'schiff_pitchfork' | 'balloon' | 'inside_pitchfork' | 'pitchfan' | 'gannbox' | 'gannbox_square' | 'gannbox_fixed' | 'gannbox_fan' | 'fib_retracement' | 'fib_trend_ext' | 'fib_speed_resist_fan' | 'fib_timezone' | 'fib_trend_time' | 'fib_circles' | 'fib_spiral' | 'fib_speed_resist_arcs' | 'fib_channel' | 'xabcd_pattern' | 'cypher_pattern' | 'abcd_pattern' | 'callout' | 'triangle_pattern' | '3divers_pattern' | 'head_and_shoulders' | 'fib_wedge' | 'elliott_impulse_wave' | 'elliott_triangle_wave' | 'elliott_triple_combo' | 'elliott_correction' | 'elliott_double_combo' | 'cyclic_lines' | 'time_cycles' | 'sine_line' | 'long_position' | 'short_position' | 'forecast' | 'date_range' | 'price_range' | 'date_and_price_range' | 'bars_pattern' | 'ghost_feed' | 'projection' | 'rectangle' | 'rotated_rectangle' | 'ellipse' | 'triangle' | 'polyline' | 'curve' | 'cursor' | 'dot' | 'arrow_cursor' | 'eraser' | 'measure' | 'zoom' | 'brush';
export declare type SymbolType = 'stock' | 'index' | 'forex' | 'futures' | 'bitcoin' | 'crypto' | 'undefined' | 'expression' | 'spread' | 'cfd';
export declare type TableElementFormatFunction = (inputs: TableFormatterInputs) => string | JQuery;
export declare type TextInputFieldValidator = (value: string) => InputFieldValidatorResult;
export declare type ThemeName = 'Light' | 'Dark';
export declare type Timezone = 'Etc/UTC' | CustomTimezones;
export declare type WatchListSymbolListAddedCallback = (listId: string, symbols: string[]) => void;
export declare type WatchListSymbolListRemovedCallback = (listId: string) => void;
export declare type WatchListSymbolListRenamedCallback = (listId: string, oldName: string, newName: string) => void;
export declare type WatchedValueCallback<T> = (value: T) => void;
export interface AccessList {
	type: 'black' | 'white';
	tools: AccessListItem[];
}
export interface AccessListItem {
	name: string;
	grayed?: boolean;
}
export interface AccountInfo {
	id: string;
	name: string;
	currency?: string;
	currencySign?: string;
}
export interface AccountManagerColumn {
	id?: string;
	label: string;
	className?: string;
	formatter?: StandardFormatterName | 'orderSettings' | 'posSettings' | string;
	property?: string;
	sortProp?: string;
	modificationProperty?: string;
	notSortable?: boolean;
	help?: string;
	highlightDiff?: boolean;
	fixedWidth?: boolean;
	notHideable?: boolean;
	hideByDefault?: boolean;
}
export interface AccountManagerInfo {
	accountTitle: string;
	accountsList?: AccountInfo[];
	account?: IWatchedValue<AccountInfo>;
	summary: AccountManagerSummaryField[];
	customFormatters?: TableElementFormatter[];
	orderColumns: OrderTableColumn[];
	orderColumnsSorting?: SortingParameters;
	historyColumns?: AccountManagerColumn[];
	historyColumnsSorting?: SortingParameters;
	positionColumns?: AccountManagerColumn[];
	tradeColumns?: AccountManagerColumn[];
	pages: AccountManagerPage[];
	possibleOrderStatuses?: OrderStatus[];
	marginUsed?: IWatchedValue<number>;
	contextMenuActions?(contextMenuEvent: JQueryEventObject, activePageActions: ActionMetaInfo[]): Promise<ActionMetaInfo[]>;
}
export interface AccountManagerPage {
	id: string;
	title: string;
	tables: AccountManagerTable[];
}
export interface AccountManagerSummaryField {
	text: string;
	wValue: IWatchedValueReadonly<number>;
	formatter?: string;
}
export interface AccountManagerTable {
	id: string;
	title?: string;
	columns: AccountManagerColumn[];
	initialSorting?: SortingParameters;
	changeDelegate: ISubscription<(data: {}) => void>;
	flags?: AccountManagerTableFlags;
	getData(paginationLastId?: string | number): Promise<{}[]>;
}
export interface AccountManagerTableFlags {
	supportPagination?: boolean;
}
export interface ActionDescription {
	text?: '-' | string;
	separator?: boolean;
	shortcut?: string;
	tooltip?: string;
	checked?: boolean;
	checkable?: boolean;
	enabled?: boolean;
	externalLink?: boolean;
	icon?: string;
}
export interface ActionDescriptionWithCallback extends ActionDescription {
	action: (a: ActionDescription) => void;
}
export interface Bar {
	time: number;
	open: number;
	high: number;
	low: number;
	close: number;
	volume?: number;
}
export interface BaseInputFieldValidatorResult {
	valid: boolean;
}
export interface Brackets {
	stopLoss?: number;
	takeProfit?: number;
}
export interface BrokerConfigFlags {
	showQuantityInsteadOfAmount?: boolean;
	supportOrderBrackets?: boolean;
	supportPositions?: boolean;
	supportPositionBrackets?: boolean;
	supportTradeBrackets?: boolean;
	supportTrades?: boolean;
	supportClosePosition?: boolean;
	supportCloseTrade?: boolean;
	supportEditAmount?: boolean;
	supportLevel2Data?: boolean;
	supportDOM?: boolean;
	supportMultiposition?: boolean;
	supportPLUpdate?: boolean;
	supportReducePosition?: boolean;
	supportReversePosition?: boolean;
	supportMarketOrders?: boolean;
	supportLimitOrders?: boolean;
	supportStopOrders?: boolean;
	supportStopLimitOrders?: boolean;
	supportDemoLiveSwitcher?: boolean;
	supportMarketBrackets?: boolean;
	supportSymbolSearch?: boolean;
	supportModifyDuration?: boolean;
	supportModifyOrder?: boolean;
	supportMargin?: boolean;
	calculatePLUsingLast?: boolean;
	cancellingBracketCancelsParentOrder?: boolean;
	cancellingOnePositionBracketsCancelsOther?: boolean;
	requiresFIFOCloseTrades?: boolean;
	supportBottomWidget?: boolean;
	/**
	 * @deprecated
	 */
	supportBrackets?: boolean;
}
export interface BrokerCustomUI {
	showOrderDialog?: (order: PreOrder | Order, focus?: OrderTicketFocusControl) => Promise<boolean>;
	showPositionDialog?: (position: Position | Trade, brackets: Brackets, focus?: OrderTicketFocusControl) => Promise<boolean>;
}
export interface ChartData {
	id: string;
	name: string;
	symbol: string;
	resolution: ResolutionString;
	content: string;
}
export interface ChartMetaInfo {
	id: string;
	name: string;
	symbol: string;
	resolution: ResolutionString;
	timestamp: number;
}
export interface ChartingLibraryWidgetConstructor {
	new (options: ChartingLibraryWidgetOptions | TradingTerminalWidgetOptions): IChartingLibraryWidget;
}
export interface ChartingLibraryWidgetOptions {
	container_id: string;
	datafeed: IBasicDataFeed | (IBasicDataFeed & IDatafeedQuotesApi);
	interval: ResolutionString;
	symbol: string;
	auto_save_delay?: number;
	autosize?: boolean;
	debug?: boolean;
	disabled_features?: string[];
	drawings_access?: AccessList;
	enabled_features?: string[];
	fullscreen?: boolean;
	height?: number;
	library_path?: string;
	locale: LanguageCode;
	numeric_formatting?: NumericFormattingParams;
	saved_data?: object;
	studies_access?: AccessList;
	study_count_limit?: number;
	symbol_search_request_delay?: number;
	timeframe?: string;
	timezone?: 'exchange' | Timezone;
	toolbar_bg?: string;
	width?: number;
	charts_storage_url?: string;
	charts_storage_api_version?: AvailableSaveloadVersions;
	client_id?: string;
	user_id?: string;
	load_last_chart?: boolean;
	studies_overrides?: StudyOverrides;
	customFormatters?: CustomFormatters;
	overrides?: Overrides;
	snapshot_url?: string;
	preset?: 'mobile';
	time_frames?: TimeFrameItem[];
	custom_css_url?: string;
	favorites?: Favorites;
	save_load_adapter?: IExternalSaveLoadAdapter;
	loading_screen?: LoadingScreenOptions;
	settings_adapter?: ISettingsAdapter;
	theme?: ThemeName;
	custom_indicators_getter?: (PineJS: PineJS) => Promise<ReadonlyArray<CustomIndicator>>;
}
export interface ContextMenuItem {
	position: 'top' | 'bottom';
	text: string;
	click: EmptyCallback;
}
export interface CreateButtonOptions {
	align: 'right' | 'left';
}
export interface CreateShapeOptions<TOverrides extends object> {
	shape?: 'arrow_up' | 'arrow_down' | 'flag' | 'vertical_line' | 'horizontal_line';
	text?: string;
	lock?: boolean;
	disableSelection?: boolean;
	disableSave?: boolean;
	disableUndo?: boolean;
	overrides?: TOverrides;
	zOrder?: 'top' | 'bottom';
	showInObjectsTree?: boolean;
}
export interface CreateStudyOptions {
	checkLimit?: boolean;
	priceScale?: StudyPriceScale;
}
export interface CreateStudyTemplateOptions {
	saveInterval?: boolean;
}
export interface CreateTradingPrimitiveOptions {
	disableUndo?: boolean;
}
export interface CrossHairMovedEventParams {
	time: number;
	price: number;
}
export interface CustomComboBoxItem {
	text: string;
	value: string;
}
export interface CustomComboBoxMetaInfo extends CustomInputFieldMetaInfo {
	inputType: 'ComboBox';
	items: CustomComboBoxItem[];
}
export interface CustomFields {
	[key: string]: any;
}
export interface CustomFormatter {
	format(date: Date): string;
	formatLocal(date: Date): string;
}
export interface CustomFormatters {
	timeFormatter: CustomFormatter;
	dateFormatter: CustomFormatter;
}
export interface CustomIndicator {
	readonly name: string;
	readonly metainfo: any;
	readonly constructor: any;
}
export interface CustomInputFieldMetaInfo {
	inputType: string;
	id: string;
	title: string;
	placeHolder?: string;
	value?: any;
	validator?: InputFieldValidator;
	customInfo?: any;
}
export interface CustomInputFieldsValues {
	[fieldId: string]: TextWithCheckboxValue | string | any;
}
export interface DOMData {
	snapshot: boolean;
	asks: DOMLevel[];
	bids: DOMLevel[];
}
export interface DOMLevel {
	price: number;
	volume: number;
}
export interface DatafeedConfiguration {
	exchanges?: Exchange[];
	supported_resolutions?: ResolutionString[];
	supports_marks?: boolean;
	supports_time?: boolean;
	supports_timescale_marks?: boolean;
	symbols_types?: DatafeedSymbolType[];
}
export interface DatafeedQuoteValues {
	ch?: number;
	chp?: number;
	short_name?: string;
	exchange?: string;
	description?: string;
	lp?: number;
	ask?: number;
	bid?: number;
	spread?: number;
	open_price?: number;
	high_price?: number;
	low_price?: number;
	prev_close_price?: number;
	volume?: number;
	original_name?: string;
	[valueName: string]: string | number | undefined;
}
export interface DatafeedSymbolType {
	name: string;
	value: string;
}
export interface DefaultContextMenuActionsParams {
}
export interface DefaultDropdownActionsParams {
	showFloatingToolbar?: boolean;
	showDOM?: boolean;
	showOrderPanel?: boolean;
	tradingProperties?: boolean;
	selectAnotherBroker?: boolean;
	disconnect?: boolean;
	showHowToUse?: boolean;
}
export interface DialogParams<CallbackType> {
	title: string;
	body: string;
	callback: CallbackType;
}
export interface EditObjectDialogEventParams {
	objectType: EditObjectDialogObjectType;
	scriptTitle: string;
}
export interface EntityInfo {
	id: EntityId;
	name: string;
}
export interface ErrorFormatterParseResult extends FormatterParseResult {
	error?: string;
	res: false;
}
export interface Exchange {
	value: string;
	name: string;
	desc: string;
}
export interface Execution extends CustomFields {
	symbol: string;
	brokerSymbol?: string;
	price: number;
	qty: number;
	side: Side;
	time: number;
}
export interface ExportDataOptions {
	from?: number;
	to?: number;
	includeTime?: boolean;
	includeSeries?: boolean;
	includedStudies: ReadonlyArray<string> | 'all';
}
export interface ExportedData {
	schema: FieldDescriptor[];
	data: Float64Array[];
}
export interface Favorites {
	intervals: ResolutionString[];
	chartTypes: string[];
}
export interface FormatterParseResult {
	res: boolean;
}
export interface GrayedObject {
	type: 'drawing' | 'study';
	name: string;
}
export interface HistoryDepth {
	resolutionBack: ResolutionBackValues;
	intervalBack: number;
}
export interface HistoryMetadata {
	noData: boolean;
	nextTime?: number | null;
}
export interface IBrokerCommon {
	chartContextMenuActions(context: ITradeContext, options?: DefaultContextMenuActionsParams): Promise<ActionMetaInfo[]>;
	isTradable(symbol: string): Promise<boolean | IsTradableResult>;
	connectionStatus(): ConnectionStatus;
	orders(): Promise<Order[]>;
	positions?(): Promise<Position[]>;
	trades?(): Promise<Trade[]>;
	executions(symbol: string): Promise<Execution[]>;
	symbolInfo(symbol: string): Promise<InstrumentInfo>;
	accountInfo(): Promise<AccountInfo>;
	accountManagerInfo(): AccountManagerInfo;
	formatter?(symbol: string, alignToMinMove: boolean): Promise<IFormatter>;
	spreadFormatter?(symbol: string): Promise<IFormatter>;
	quantityFormatter?(symbol: string): Promise<IFormatter>;
}
export interface IBrokerConnectionAdapterFactory {
	createDelegate<T extends Function>(): IDelegate<T>;
	createWatchedValue<T>(value?: T): IWatchedValue<T>;
	createPriceFormatter(priceScale: number, minMove: number, fractional: boolean, minMove2: number): IFormatter;
}
export interface IBrokerConnectionAdapterHost {
	factory: IBrokerConnectionAdapterFactory;
	connectionStatusUpdate(status: ConnectionStatus, message?: string): void;
	defaultFormatter(symbol: string, alignToMinMove: boolean): Promise<IFormatter>;
	numericFormatter(decimalPlaces: number): Promise<IFormatter>;
	quantityFormatter(decimalPlaces?: number): Promise<IFormatter>;
	defaultContextMenuActions(context: ITradeContext, params?: DefaultContextMenuActionsParams): Promise<ActionMetaInfo[]>;
	defaultDropdownMenuActions(options?: Partial<DefaultDropdownActionsParams>): ActionMetaInfo[];
	floatingTradingPanelVisibility(): IWatchedValue<boolean>;
	domPanelVisibility(): IWatchedValue<boolean>;
	orderPanelVisibility(): IWatchedValue<boolean>;
	silentOrdersPlacement(): IWatchedValue<boolean>;
	patchConfig(config: Partial<BrokerConfigFlags>): void;
	patchOrderDialogOptions(options: OrderDialogOptions): void;
	setDurations(durations: OrderDurationMetaInfo[]): void;
	orderUpdate(order: Order, isHistoryUpdate?: boolean): void;
	orderPartialUpdate(id: string, orderChanges: Partial<Order>): void;
	positionUpdate(position: Position, isHistoryUpdate?: boolean): void;
	positionPartialUpdate(id: string, positionChanges: Partial<Position>): void;
	tradeUpdate(trade: Trade, isHistoryUpdate?: boolean): void;
	tradePartialUpdate(id: string, tradeChanges: Partial<Trade>): void;
	executionUpdate(execution: Execution, isHistoryUpdate?: boolean): void;
	fullUpdate(): void;
	realtimeUpdate(symbol: string, data: TradingQuotes): void;
	plUpdate(positionId: string, pl: number): void;
	pipValueUpdate(symbol: string, pipValues: PipValues): void;
	tradePLUpdate(tradeId: string, pl: number): void;
	equityUpdate(equity: number): void;
	marginAvailableUpdate(marginAvailable: number): void;
	domeUpdate(symbol: string, equity: DOMData): void;
	showOrderDialog<T extends PreOrder>(order: T, handler: (order: T) => Promise<void>, focus?: OrderTicketFocusControl, options?: OrderDialogOptions): Promise<void>;
	showCancelOrderDialog(orderId: string, handler: () => Promise<void>): Promise<void>;
	showCancelMultipleOrdersDialog(symbol: string, side: Side | undefined, qty: number, handler: () => Promise<void>): Promise<void>;
	showCancelBracketsDialog(orderId: string, handler: () => Promise<void>): Promise<void>;
	showCancelMultipleBracketsDialog(orderId: string, handler: () => Promise<void>): Promise<void>;
	showClosePositionDialog(positionId: string, handler: () => Promise<void>): Promise<void>;
	showReversePositionDialog(position: Position, handler: () => Promise<void>): Promise<void>;
	showPositionBracketsDialog(position: Position | Trade, brackets: Brackets, focus: OrderTicketFocusControl | null, handler: (brackets: Brackets) => Promise<void>): Promise<void>;
	showNotification(title: string, text: string, notificationType?: NotificationType): void;
	setButtonDropdownActions(descriptions: ActionMetaInfo[]): void;
	activateBottomWidget(): Promise<void>;
	showTradingProperties(): void;
	suggestedQty(): SuggestedQuantity;
	symbolSnapshot(symbol: string): Promise<QuotesBase>;
	showMessageDialog(caption: string, message: string): void;
}
export interface IBrokerTerminal extends IBrokerWithoutRealtime {
	subscribeRealtime(symbol: string): void;
	unsubscribeRealtime(symbol: string): void;
}
export interface IBrokerWithoutRealtime extends IBrokerCommon {
	subscribeDOME?(symbol: string): void;
	unsubscribeDOME?(symbol: string): void;
	placeOrder(order: PreOrder): Promise<void>;
	modifyOrder(order: Order): Promise<void>;
	cancelOrder(orderId: string): Promise<void>;
	cancelOrders(symbol: string, side: Side | undefined, ordersIds: string[]): Promise<void>;
	reversePosition?(positionId: string): Promise<void>;
	closePosition?(positionId: string): Promise<void>;
	closeTrade?(tradeId: string): Promise<void>;
	editPositionBrackets?(positionId: string, brackets?: Brackets): Promise<void>;
	editTradeBrackets?(tradeId: string, brackets?: Brackets): Promise<void>;
	/**
	 * @deprecated Brokers should always send PL and equity updates
	 */
	subscribePL?(positionId: string): void;
	subscribeEquity?(): void;
	subscribeMarginAvailable?(symbol: string): void;
	subscribePipValue?(symbol: string): void;
	unsubscribePipValue?(symbol: string): void;
	unsubscribeMarginAvailable?(symbol: string): void;
	/**
	 * @deprecated
	 */
	unsubscribePL?(positionId: string): void;
	unsubscribeEquity?(): void;
}
export interface IChartWidgetApi {
	onDataLoaded(): ISubscription<() => void>;
	onSymbolChanged(): ISubscription<() => void>;
	onIntervalChanged(): ISubscription<(interval: ResolutionString, timeFrameParameters: {
		timeframe?: string;
	}) => void>;
	onVisibleRangeChanged(): ISubscription<() => void>;
	dataReady(callback: () => void): boolean;
	crossHairMoved(callback: (params: CrossHairMovedEventParams) => void): void;
	setVisibleRange(range: VisibleTimeRange, applyDefaultRightMargin?: boolean): Promise<void>;
	setSymbol(symbol: string, callback: () => void): void;
	setResolution(resolution: ResolutionString, callback: () => void): void;
	resetData(): void;
	executeActionById(actionId: ChartActionId): void;
	getCheckableActionState(actionId: ChartActionId): boolean;
	refreshMarks(): void;
	clearMarks(): void;
	setChartType(type: SeriesStyle): void;
	getAllShapes(): EntityInfo[];
	getAllStudies(): EntityInfo[];
	/**
	 * @deprecated Use shape/study API instead ([getStudyById] / [getShapeById])
	 */
	setEntityVisibility(entityId: EntityId, isVisible: boolean): void;
	createStudy<TStudyInputValue extends StudyInputValue, TOverrides extends StudyOverrides>(name: string, forceOverlay: boolean, lock?: boolean, inputs?: TStudyInputValue[], overrides?: TOverrides, options?: CreateStudyOptions): Promise<EntityId | null>;
	getStudyById(entityId: EntityId): IStudyApi;
	getSeries(): ISeriesApi;
	createShape<TOverrides extends object>(point: ShapePoint, options: CreateShapeOptions<TOverrides>): EntityId | null;
	createMultipointShape<TOverrides extends object>(points: ShapePoint[], options: CreateShapeOptions<TOverrides>): EntityId | null;
	getShapeById(entityId: EntityId): ILineDataSourceApi;
	removeEntity(entityId: EntityId): void;
	removeAllShapes(): void;
	removeAllStudies(): void;
	selection(): ISelectionApi;
	showPropertiesDialog(studyId: EntityId): void;
	createStudyTemplate(options: CreateStudyTemplateOptions): object;
	applyStudyTemplate(template: object): void;
	createOrderLine(options: CreateTradingPrimitiveOptions): IOrderLineAdapter;
	createPositionLine(options: CreateTradingPrimitiveOptions): IPositionLineAdapter;
	createExecutionShape(options: CreateTradingPrimitiveOptions): IExecutionLineAdapter;
	symbol(): string;
	symbolExt(): SymbolExt;
	resolution(): ResolutionString;
	getVisibleRange(): VisibleTimeRange;
	/**
	 * @deprecated Use Price Scale API instead
	 */
	getVisiblePriceRange(): VisiblePriceRange;
	scrollPosition(): number;
	defaultScrollPosition(): number;
	priceFormatter(): IFormatter;
	chartType(): SeriesStyle;
	setTimezone(timezone: 'exchange' | Timezone): void;
	getTimezone(): 'exchange' | Timezone;
	getPanes(): IPaneApi[];
	exportData(options?: ExportDataOptions): Promise<ExportedData>;
	canZoomOut(): boolean;
	zoomOut(): void;
	setZoomEnabled(enabled: boolean): void;
	setScrollEnabled(enabled: boolean): void;
}
export interface IChartingLibraryWidget {
	headerReady(): Promise<void>;
	onChartReady(callback: EmptyCallback): void;
	onGrayedObjectClicked(callback: (obj: GrayedObject) => void): void;
	onShortcut(shortCut: string, callback: EmptyCallback): void;
	subscribe<EventName extends keyof SubscribeEventsMap>(event: EventName, callback: SubscribeEventsMap[EventName]): void;
	unsubscribe<EventName extends keyof SubscribeEventsMap>(event: EventName, callback: SubscribeEventsMap[EventName]): void;
	chart(index?: number): IChartWidgetApi;
	setLanguage(lang: LanguageCode): void;
	setSymbol(symbol: string, interval: ResolutionString, callback: EmptyCallback): void;
	remove(): void;
	closePopupsAndDialogs(): void;
	selectLineTool(linetool: SupportedLineTools): void;
	selectedLineTool(): SupportedLineTools;
	save(callback: (state: object) => void): void;
	load(state: object): void;
	getSavedCharts(callback: (chartRecords: SaveLoadChartRecord[]) => void): void;
	loadChartFromServer(chartRecord: SaveLoadChartRecord): void;
	saveChartToServer(onComplete?: EmptyCallback, onFail?: EmptyCallback, options?: SaveChartToServerOptions): void;
	removeChartFromServer(chartId: string, onCompleteCallback: EmptyCallback): void;
	onContextMenu(callback: (unixTime: number, price: number) => ContextMenuItem[]): void;
	createButton(options?: CreateButtonOptions): HTMLElement;
	showNoticeDialog(params: DialogParams<() => void>): void;
	showConfirmDialog(params: DialogParams<(confirmed: boolean) => void>): void;
	showLoadChartDialog(): void;
	showSaveAsChartDialog(): void;
	symbolInterval(): SymbolIntervalResult;
	mainSeriesPriceFormatter(): IFormatter;
	getIntervals(): string[];
	getStudiesList(): string[];
	addCustomCSSFile(url: string): void;
	applyOverrides<TOverrides extends StudyOverrides>(overrides: TOverrides): void;
	applyStudiesOverrides(overrides: object): void;
	watchList(): WatchListApi;
	activeChart(): IChartWidgetApi;
	chartsCount(): number;
	layout(): LayoutType;
	setLayout(layout: LayoutType): void;
	layoutName(): string;
	changeTheme(themeName: ThemeName): void;
	takeScreenshot(): void;
	lockAllDrawingTools(): IWatchedValue<boolean>;
	hideAllDrawingTools(): IWatchedValue<boolean>;
	magnetEnabled(): IWatchedValue<boolean>;
	magnetMode(): IWatchedValue<number>;
	undoRedoState(): UndoRedoState;
}
export interface IDatafeedChartApi {
	calculateHistoryDepth?(resolution: ResolutionString, resolutionBack: ResolutionBackValues, intervalBack: number): HistoryDepth | undefined;
	getMarks?(symbolInfo: LibrarySymbolInfo, from: number, to: number, onDataCallback: GetMarksCallback<Mark>, resolution: ResolutionString): void;
	getTimescaleMarks?(symbolInfo: LibrarySymbolInfo, from: number, to: number, onDataCallback: GetMarksCallback<TimescaleMark>, resolution: ResolutionString): void;
	/**
	 * This function is called if configuration flag supports_time is set to true when chart needs to know the server time.
	 * The charting library expects callback to be called once.
	 * The time is provided without milliseconds. Example: 1445324591. It is used to display Countdown on the price scale.
	 */
	getServerTime?(callback: ServerTimeCallback): void;
	searchSymbols(userInput: string, exchange: string, symbolType: string, onResult: SearchSymbolsCallback): void;
	resolveSymbol(symbolName: string, onResolve: ResolveCallback, onError: ErrorCallback): void;
	getBars(symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, rangeStartDate: number, rangeEndDate: number, onResult: HistoryCallback, onError: ErrorCallback, isFirstCall: boolean): void;
	subscribeBars(symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, onTick: SubscribeBarsCallback, listenerGuid: string, onResetCacheNeededCallback: () => void): void;
	unsubscribeBars(listenerGuid: string): void;
	subscribeDepth?(symbol: string, callback: DomeCallback): string;
	unsubscribeDepth?(subscriberUID: string): void;
}
export interface IDatafeedQuotesApi {
	getQuotes(symbols: string[], onDataCallback: QuotesCallback, onErrorCallback: (msg: string) => void): void;
	subscribeQuotes(symbols: string[], fastSymbols: string[], onRealtimeCallback: QuotesCallback, listenerGUID: string): void;
	unsubscribeQuotes(listenerGUID: string): void;
}
export interface IDelegate<TFunc extends Function> extends ISubscription<TFunc> {
	fire: TFunc;
}
export interface IExecutionLineAdapter {
	remove(): void;
	getPrice(): number;
	setPrice(value: number): this;
	getTime(): number;
	setTime(value: number): this;
	getDirection(): Direction;
	setDirection(value: Direction): this;
	getText(): string;
	setText(value: string): this;
	getTooltip(): string;
	setTooltip(value: string): this;
	getArrowHeight(): number;
	setArrowHeight(value: number): this;
	getArrowSpacing(): number;
	setArrowSpacing(value: number): this;
	getFont(): string;
	setFont(value: string): this;
	getTextColor(): string;
	setTextColor(value: string): this;
	getArrowColor(): string;
	setArrowColor(value: string): this;
}
export interface IExternalDatafeed {
	onReady(callback: OnReadyCallback): void;
}
export interface IExternalSaveLoadAdapter {
	getAllCharts(): Promise<ChartMetaInfo[]>;
	removeChart(chartId: string): Promise<void>;
	saveChart(chartData: ChartData): Promise<string>;
	getChartContent(chartId: string): Promise<string>;
	getAllStudyTemplates(): Promise<StudyTemplateMetaInfo[]>;
	removeStudyTemplate(studyTemplateInfo: StudyTemplateMetaInfo): Promise<void>;
	saveStudyTemplate(studyTemplateData: StudyTemplateData): Promise<void>;
	getStudyTemplateContent(studyTemplateInfo: StudyTemplateMetaInfo): Promise<string>;
}
export interface IFormatter {
	format(value: any): string;
	parse?(value: string): ErrorFormatterParseResult | SuccessFormatterParseResult;
}
export interface ILineDataSourceApi {
	isSelectionEnabled(): boolean;
	setSelectionEnabled(enable: boolean): void;
	isSavingEnabled(): boolean;
	setSavingEnabled(enable: boolean): void;
	isShowInObjectsTreeEnabled(): boolean;
	setShowInObjectsTreeEnabled(enabled: boolean): void;
	isUserEditEnabled(): boolean;
	setUserEditEnabled(enabled: boolean): void;
	bringToFront(): void;
	sendToBack(): void;
	getProperties(): object;
	setProperties(newProperties: object): void;
	getPoints(): PricedPoint[];
	setPoints(points: ShapePoint[]): void;
}
export interface IOrderLineAdapter {
	remove(): void;
	onModify(callback: () => void): this;
	onModify<T>(data: T, callback: (data: T) => void): this;
	onMove(callback: () => void): this;
	onMove<T>(data: T, callback: (data: T) => void): this;
	onCancel(callback: () => void): this;
	onCancel<T>(data: T, callback: (data: T) => void): this;
	getPrice(): number;
	setPrice(value: number): this;
	getText(): string;
	setText(value: string): this;
	getTooltip(): string;
	setTooltip(value: string): this;
	getModifyTooltip(): string;
	setModifyTooltip(value: string): this;
	getCancelTooltip(): string;
	setCancelTooltip(value: string): this;
	getQuantity(): string;
	setQuantity(value: string): this;
	getEditable(): boolean;
	setEditable(value: boolean): this;
	getExtendLeft(): boolean;
	setExtendLeft(value: boolean): this;
	getLineLength(): number;
	setLineLength(value: number): this;
	getLineStyle(): number;
	setLineStyle(value: number): this;
	getLineWidth(): number;
	setLineWidth(value: number): this;
	getBodyFont(): string;
	setBodyFont(value: string): this;
	getQuantityFont(): string;
	setQuantityFont(value: string): this;
	getLineColor(): string;
	setLineColor(value: string): this;
	getBodyBorderColor(): string;
	setBodyBorderColor(value: string): this;
	getBodyBackgroundColor(): string;
	setBodyBackgroundColor(value: string): this;
	getBodyTextColor(): string;
	setBodyTextColor(value: string): this;
	getQuantityBorderColor(): string;
	setQuantityBorderColor(value: string): this;
	getQuantityBackgroundColor(): string;
	setQuantityBackgroundColor(value: string): this;
	getQuantityTextColor(): string;
	setQuantityTextColor(value: string): this;
	getCancelButtonBorderColor(): string;
	setCancelButtonBorderColor(value: string): this;
	getCancelButtonBackgroundColor(): string;
	setCancelButtonBackgroundColor(value: string): this;
	getCancelButtonIconColor(): string;
	setCancelButtonIconColor(value: string): this;
}
export interface IPaneApi {
	hasMainSeries(): boolean;
	getLeftPriceScales(): ReadonlyArray<IPriceScaleApi>;
	getRightPriceScales(): ReadonlyArray<IPriceScaleApi>;
	getMainSourcePriceScale(): IPriceScaleApi | null;
	getHeight(): number;
	setHeight(height: number): void;
	moveTo(paneIndex: number): void;
	paneIndex(): number;
}
export interface IPositionLineAdapter {
	remove(): void;
	onClose(callback: () => void): this;
	onClose<T>(data: T, callback: (data: T) => void): this;
	onModify(callback: () => void): this;
	onModify<T>(data: T, callback: (data: T) => void): this;
	onReverse(callback: () => void): this;
	onReverse<T>(data: T, callback: (data: T) => void): this;
	getPrice(): number;
	setPrice(value: number): this;
	getText(): string;
	setText(value: string): this;
	getTooltip(): string;
	setTooltip(value: string): this;
	getProtectTooltip(): string;
	setProtectTooltip(value: string): this;
	getCloseTooltip(): string;
	setCloseTooltip(value: string): this;
	getReverseTooltip(): string;
	setReverseTooltip(value: string): this;
	getQuantity(): string;
	setQuantity(value: string): this;
	getExtendLeft(): boolean;
	setExtendLeft(value: boolean): this;
	getLineLength(): number;
	setLineLength(value: number): this;
	getLineStyle(): number;
	setLineStyle(value: number): this;
	getLineWidth(): number;
	setLineWidth(value: number): this;
	getBodyFont(): string;
	setBodyFont(value: string): this;
	getQuantityFont(): string;
	setQuantityFont(value: string): this;
	getLineColor(): string;
	setLineColor(value: string): this;
	getBodyBorderColor(): string;
	setBodyBorderColor(value: string): this;
	getBodyBackgroundColor(): string;
	setBodyBackgroundColor(value: string): this;
	getBodyTextColor(): string;
	setBodyTextColor(value: string): this;
	getQuantityBorderColor(): string;
	setQuantityBorderColor(value: string): this;
	getQuantityBackgroundColor(): string;
	setQuantityBackgroundColor(value: string): this;
	getQuantityTextColor(): string;
	setQuantityTextColor(value: string): this;
	getReverseButtonBorderColor(): string;
	setReverseButtonBorderColor(value: string): this;
	getReverseButtonBackgroundColor(): string;
	setReverseButtonBackgroundColor(value: string): this;
	getReverseButtonIconColor(): string;
	setReverseButtonIconColor(value: string): this;
	getCloseButtonBorderColor(): string;
	setCloseButtonBorderColor(value: string): this;
	getCloseButtonBackgroundColor(): string;
	setCloseButtonBackgroundColor(value: string): this;
	getCloseButtonIconColor(): string;
	setCloseButtonIconColor(value: string): this;
}
export interface IPriceScaleApi {
	getMode(): PriceScaleMode;
	setMode(newMode: PriceScaleMode): void;
	isInverted(): boolean;
	setInverted(isInverted: boolean): void;
	getVisiblePriceRange(): VisiblePriceRange | null;
	setVisiblePriceRange(range: VisiblePriceRange): void;
}
export interface ISelectionApi {
	add(entities: EntityId[]): void;
	set(entities: EntityId[]): void;
	remove(entities: EntityId[]): void;
	contains(entity: EntityId): boolean;
	allSources(): EntityId[];
	isEmpty(): boolean;
	clear(): void;
	onChanged(): ISubscription<() => void>;
}
export interface ISeriesApi {
	isUserEditEnabled(): boolean;
	setUserEditEnabled(enabled: boolean): void;
	mergeUp(): void;
	mergeDown(): void;
	unmergeUp(): void;
	unmergeDown(): void;
	detachToRight(): void;
	detachToLeft(): void;
	detachNoScale(): void;
	moveToOtherSourceScale(entityId: EntityId): void;
	isVisible(): boolean;
	setVisible(visible: boolean): void;
	bringToFront(): void;
	sendToBack(): void;
	entityId(): EntityId;
}
export interface ISettingsAdapter {
	initialSettings?: InitialSettingsMap;
	setValue(key: string, value: string): void;
	removeValue(key: string): void;
}
export interface IStudyApi {
	isUserEditEnabled(): boolean;
	setUserEditEnabled(enabled: boolean): void;
	getInputsInfo(): StudyInputInfo[];
	getInputValues(): StudyInputValueItem[];
	setInputValues(values: StudyInputValueItem[]): void;
	mergeUp(): void;
	mergeDown(): void;
	unmergeUp(): void;
	unmergeDown(): void;
	changePriceScale(newPriceScale: StudyPriceScale): void;
	isVisible(): boolean;
	setVisible(visible: boolean): void;
	bringToFront(): void;
	sendToBack(): void;
	applyOverrides<TOverrides extends StudyOverrides>(overrides: TOverrides): void;
}
export interface ISubscription<TFunc extends Function> {
	subscribe(obj: object | null, member: TFunc, singleshot?: boolean): void;
	unsubscribe(obj: object | null, member: TFunc): void;
	unsubscribeAll(obj: object | null): void;
}
export interface ITradeContext {
	symbol: string;
	displaySymbol: string;
	value: number | null;
	formattedValue: string;
	last: number;
}
export interface IWatchedValue<T> extends IWatchedValueReadonly<T> {
	value(): T;
	setValue(value: T, forceUpdate?: boolean): void;
	subscribe(callback: WatchedValueCallback<T>, options?: WatchedValueSubscribeOptions): void;
	unsubscribe(callback?: WatchedValueCallback<T> | null): void;
}
export interface IWatchedValueReadonly<T> {
	value(): T;
	subscribe(callback: (value: T) => void, options?: WatchedValueSubscribeOptions): void;
	unsubscribe(callback?: ((value: T) => void) | null): void;
}
export interface InitialSettingsMap {
	[key: string]: string;
}
export interface InstrumentInfo {
	qty: QuantityMetainfo;
	pipValue: number;
	pipSize: number;
	minTick: number;
	lotSize?: number;
	type?: SymbolType;
	brokerSymbol?: string;
	description: string;
	domVolumePrecision?: number;
	leverage?: string;
	marginRate?: number;
}
export interface IsTradableResult {
	tradable: boolean;
	reason?: string;
}
export interface LibrarySymbolInfo {
	/**
	 * Symbol Name
	 */
	name: string;
	full_name: string;
	base_name?: [string];
	/**
	 * Unique symbol id
	 */
	ticker?: string;
	description: string;
	type: string;
	/**
	 * @example "1700-0200"
	 */
	session: string;
	/**
	 * Traded exchange
	 * @example "NYSE"
	 */
	exchange: string;
	listed_exchange: string;
	timezone: Timezone;
	/**
	 * Prices format: "price" or "volume"
	 */
	format: SeriesFormat;
	/**
	 * Code (Tick)
	 * @example 8/16/.../256 (1/8/100 1/16/100 ... 1/256/100) or 1/10/.../10000000 (1 0.1 ... 0.0000001)
	 */
	pricescale: number;
	/**
	 * The number of units that make up one tick.
	 * @example For example, U.S. equities are quotes in decimals, and tick in decimals, and can go up +/- .01. So the tick increment is 1. But the e-mini S&P futures contract, though quoted in decimals, goes up in .25 increments, so the tick increment is 25. (see also Tick Size)
	 */
	minmov: number;
	fractional?: boolean;
	/**
	 * @example Quarters of 1/32: pricescale=128, minmovement=1, minmovement2=4
	 */
	minmove2?: number;
	/**
	 * false if DWM only
	 */
	has_intraday?: boolean;
	/**
	 * An array of resolutions which should be enabled in resolutions picker for this symbol.
	 */
	supported_resolutions: ResolutionString[];
	/**
	 * @example (for ex.: "1,5,60") - only these resolutions will be requested, all others will be built using them if possible
	 */
	intraday_multipliers?: string[];
	has_seconds?: boolean;
	/**
	 * It is an array containing seconds resolutions (in seconds without a postfix) the datafeed builds by itself.
	 */
	seconds_multipliers?: string[];
	has_daily?: boolean;
	has_weekly_and_monthly?: boolean;
	has_empty_bars?: boolean;
	force_session_rebuild?: boolean;
	has_no_volume?: boolean;
	/**
	 * Integer showing typical volume value decimal places for this symbol
	 */
	volume_precision?: number;
	data_status?: 'streaming' | 'endofday' | 'pulsed' | 'delayed_streaming';
	/**
	 * Boolean showing whether this symbol is expired futures contract or not.
	 */
	expired?: boolean;
	/**
	 * Unix timestamp of expiration date.
	 */
	expiration_date?: number;
	sector?: string;
	industry?: string;
	currency_code?: string;
}
export interface LoadingScreenOptions {
	foregroundColor?: string;
	backgroundColor?: string;
}
export interface Mark {
	id: string | number;
	time: number;
	color: MarkConstColors | MarkCustomColor;
	text: string;
	label: string;
	labelFontColor: string;
	minSize: number;
}
export interface MarkCustomColor {
	color: string;
	background: string;
}
export interface MenuSeparator extends ActionDescription {
	separator: boolean;
}
export interface MouseEventParams {
	clientX: number;
	clientY: number;
	pageX: number;
	pageY: number;
	screenX: number;
	screenY: number;
}
export interface NegativeBaseInputFieldValidatorResult extends BaseInputFieldValidatorResult {
	valid: false;
	errorMessage: string;
}
export interface NewsItem {
	fullDescription: string;
	link?: string;
	published: number;
	shortDescription?: string;
	source: string;
	title: string;
}
export interface NewsProvider {
	is_news_generic?: boolean;
	get_news(symbol: string, callback: (items: NewsItem[]) => void): void;
}
export interface NumericFormattingParams {
	decimal_sign: string;
}
export interface OrderDialogOptions {
	customFields?: OrderDialogCustomField[];
}
export interface OrderDuration {
	/**
	 * type is OrderDurationMetaInfo.value
	 */
	type: string;
	datetime?: number;
}
export interface OrderDurationMetaInfo {
	hasDatePicker?: boolean;
	hasTimePicker?: boolean;
	default?: boolean;
	name: string;
	value: string;
}
export interface OrderTableColumn extends AccountManagerColumn {
	supportedStatusFilters?: OrderStatusFilter[];
}
export interface OrderWithParent extends PlacedOrder {
	parentId: string;
	parentType: ParentType;
}
export interface Overrides {
	[key: string]: string | number | boolean;
}
export interface PipValues {
	buyPipValue: number;
	sellPipValue: number;
}
export interface PlacedOrder extends PreOrder, CustomFields {
	id: string;
	filledQty?: number;
	avgPrice?: number;
	updateTime?: number; /** unix timestamp in milliseconds */
	takeProfit?: number;
	stopLoss?: number;
	type: OrderType;
	side: Side;
	status: OrderStatus;
}
export interface Position {
	id: string;
	symbol: string;
	brokerSymbol?: string;
	qty: number;
	side: Side;
	avgPrice: number;
	[key: string]: any;
}
export interface PositiveBaseInputFieldValidatorResult extends BaseInputFieldValidatorResult {
	valid: true;
}
export interface PreOrder {
	symbol: string;
	brokerSymbol?: string;
	type?: OrderType;
	side?: Side;
	qty: number;
	status?: OrderStatus;
	stopPrice?: number;
	limitPrice?: number;
	stopLoss?: number;
	takeProfit?: number;
	duration?: OrderDuration;
	customFields?: CustomInputFieldsValues;
}
export interface PricedPoint extends TimePoint {
	price: number;
}
export interface QuantityMetainfo {
	min: number;
	max: number;
	step: number;
	default?: number;
}
export interface QuoteErrorData {
	s: 'error';
	n: string;
	v: object;
}
export interface QuoteOkData {
	s: 'ok';
	n: string;
	v: DatafeedQuoteValues;
}
export interface QuotesBase {
	change: number;
	change_percent: number;
	last_price: number;
	fractional: boolean;
	minmov: number;
	minmove2: number;
	pricescale: number;
	description: string;
}
export interface RestBrokerMetaInfo {
	url: string;
	access_token: string;
}
export interface RssNewsFeedInfo {
	url: string;
	name: string;
}
export interface RssNewsFeedParams {
	default: RssNewsFeedItem;
	[symbolType: string]: RssNewsFeedItem;
}
export interface SaveChartToServerOptions {
	chartName?: string;
	defaultChartName?: string;
}
export interface SaveLoadChartRecord {
	id: string;
	name: string;
	image_url: string;
	modified_iso: number;
	short_symbol: string;
	interval: ResolutionString;
}
export interface SearchSymbolResultItem {
	symbol: string;
	full_name: string;
	description: string;
	exchange: string;
	ticker: string;
	type: string;
}
export interface SeriesFieldDescriptor {
	type: 'value';
	sourceType: 'series';
	plotTitle: string;
}
export interface SingleBrokerMetaInfo {
	configFlags: BrokerConfigFlags;
	customNotificationFields?: string[];
	durations?: OrderDurationMetaInfo[];
	orderDialogOptions?: OrderDialogOptions;
	customUI?: BrokerCustomUI;
}
export interface SortingParameters {
	columnId: string;
	asc?: boolean;
}
export interface StickedPoint extends TimePoint {
	channel: 'open' | 'high' | 'low' | 'close';
}
export interface StudyFieldDescriptor {
	type: 'value';
	sourceType: 'study';
	sourceId: string;
	sourceTitle: string;
	plotTitle: string;
}
export interface StudyInputInfo {
	id: StudyInputId;
	name: string;
	type: string;
	localizedName: string;
}
export interface StudyInputValueItem {
	id: StudyInputId;
	value: StudyInputValue;
}
export interface StudyOrDrawingAddedToChartEventParams {
	value: string;
}
export interface StudyOverrides {
	[key: string]: StudyOverrideValueType;
}
export interface StudyTemplateData {
	name: string;
	content: string;
}
export interface StudyTemplateMetaInfo {
	name: string;
}
export interface SubscribeEventsMap {
	toggle_sidebar: (isHidden: boolean) => void;
	indicators_dialog: EmptyCallback;
	toggle_header: (isHidden: boolean) => void;
	edit_object_dialog: (params: EditObjectDialogEventParams) => void;
	chart_load_requested: (savedData: object) => void;
	chart_loaded: EmptyCallback;
	mouse_down: (params: MouseEventParams) => void;
	mouse_up: (params: MouseEventParams) => void;
	drawing: (params: StudyOrDrawingAddedToChartEventParams) => void;
	study: (params: StudyOrDrawingAddedToChartEventParams) => void;
	undo: EmptyCallback;
	redo: EmptyCallback;
	undoRedoStackChanged: (state: UndoRedoState) => void;
	reset_scales: EmptyCallback;
	compare_add: EmptyCallback;
	add_compare: EmptyCallback;
	'load_study template': EmptyCallback;
	onTick: (tick: Bar) => void;
	onAutoSaveNeeded: EmptyCallback;
	onScreenshotReady: (url: string) => void;
	onMarkClick: (markId: Mark['id']) => void;
	onTimescaleMarkClick: (markId: TimescaleMark['id']) => void;
	onSelectedLineToolChanged: EmptyCallback;
	layout_about_to_be_changed: (newLayoutType: LayoutType) => void;
	layout_changed: EmptyCallback;
	activeChartChanged: (chartIndex: number) => void;
	drawing_event: (soursceId: string, drawingEventType: DrawingEventType) => void;
}
export interface SuccessFormatterParseResult extends FormatterParseResult {
	res: true;
	suggest?: string;
}
export interface SuggestedQuantity {
	changed: IDelegate<(symbol: string) => void>;
	value(symbol: string): Promise<number>;
	setValue(symbol: string, value: number): void;
}
export interface SymbolExt {
	symbol: string;
	full_name: string;
	exchange: string;
	description: string;
	type: string;
}
export interface SymbolIntervalResult {
	symbol: string;
	interval: ResolutionString;
}
export interface TableElementFormatter {
	name: string;
	format: TableElementFormatFunction;
}
export interface TableFormatterInputs {
	value: number | string | Side | OrderType | OrderStatus;
	prevValue?: number | undefined;
	row: TableRow;
	$container: JQuery;
	priceFormatter?: IFormatter;
}
export interface TableRow {
	priceFormatter?: IFormatter;
	[name: string]: any;
}
export interface TextWithCheckboxFieldCustomInfo {
	checkboxTitle: string;
	asterix?: boolean;
}
export interface TextWithCheckboxFieldMetaInfo extends CustomInputFieldMetaInfo {
	inputType: 'TextWithCheckBox';
	value: TextWithCheckboxValue;
	customInfo: TextWithCheckboxFieldCustomInfo;
	validator?: TextInputFieldValidator;
}
export interface TextWithCheckboxValue {
	text: string;
	checked: boolean;
}
export interface TimeFieldDescriptor {
	type: 'time';
}
export interface TimeFrameItem {
	text: string;
	resolution: ResolutionString;
	description?: string;
	title?: string;
}
export interface TimePoint {
	time: number;
}
export interface TimescaleMark {
	id: string | number;
	time: number;
	color: MarkConstColors | string;
	label: string;
	tooltip: string[];
}
export interface Trade extends CustomFields {
	id: string;
	date: number;
	symbol: string;
	brokerSymbol?: string;
	qty: number;
	side: Side;
	price: number;
}
export interface TradingCustomization {
	position: Overrides;
	order: Overrides;
}
export interface TradingQuotes {
	trade?: number;
	size?: number;
	bid?: number;
	bid_size?: number;
	ask?: number;
	ask_size?: number;
	spread?: number;
}
export interface TradingTerminalWidgetOptions extends ChartingLibraryWidgetOptions {
	brokerConfig?: SingleBrokerMetaInfo;
	restConfig?: RestBrokerMetaInfo;
	widgetbar?: WidgetBarParams;
	rss_news_feed?: RssNewsFeedParams;
	news_provider?: NewsProvider;
	trading_customization?: TradingCustomization;
	brokerFactory?(host: IBrokerConnectionAdapterHost): IBrokerWithoutRealtime | IBrokerTerminal;
}
export interface UndoRedoState {
	enableUndo: boolean;
	undoText: string | undefined;
	enableRedo: boolean;
	redoText: string | undefined;
}
export interface VisiblePriceRange {
	from: number;
	to: number;
}
export interface VisibleTimeRange {
	from: number;
	to: number;
}
export interface WatchListApi {
	defaultList(): string[];
	getList(id?: string): string[] | null;
	getAllLists(): WatchListSymbolListMap | null;
	getActiveListId(): string | null;
	setList(symbols: string[]): void;
	updateList(listId: string, symbols: string[]): void;
	renameList(listId: string, newName: string): void;
	createList(listName?: string, symbols?: string[]): WatchListSymbolList | null;
	saveList(list: WatchListSymbolList): boolean;
	deleteList(listId: string): void;
	onListChanged(): ISubscription<EmptyCallback>;
	onActiveListChanged(): ISubscription<EmptyCallback>;
	onListAdded(): ISubscription<WatchListSymbolListAddedCallback>;
	onListRemoved(): ISubscription<WatchListSymbolListRemovedCallback>;
	onListRenamed(): ISubscription<WatchListSymbolListRenamedCallback>;
}
export interface WatchListSymbolList extends WatchListSymbolListData {
	id: string;
}
export interface WatchListSymbolListData {
	symbols: string[];
	title: string;
}
export interface WatchListSymbolListMap {
	[listId: string]: WatchListSymbolList;
}
export interface WatchedValueSubscribeOptions {
	once?: boolean;
	callWithLast?: boolean;
}
export interface WidgetBarParams {
	details?: boolean;
	watchlist?: boolean;
	news?: boolean;
	watchlist_settings?: {
		default_symbols: string[];
		readonly?: boolean;
	};
}
export type CustomTimezones = 'Africa/Cairo' | 'Africa/Johannesburg' | 'Africa/Lagos' | 'America/Argentina/Buenos_Aires' | 'America/Bogota' | 'America/Caracas' | 'America/Chicago' | 'America/El_Salvador' | 'America/Juneau' | 'America/Lima' | 'America/Los_Angeles' | 'America/Mexico_City' | 'America/New_York' | 'America/Phoenix' | 'America/Santiago' | 'America/Sao_Paulo' | 'America/Toronto' | 'America/Vancouver' | 'Asia/Almaty' | 'Asia/Ashkhabad' | 'Asia/Bahrain' | 'Asia/Bangkok' | 'Asia/Chongqing' | 'Asia/Dubai' | 'Asia/Ho_Chi_Minh' | 'Asia/Hong_Kong' | 'Asia/Jakarta' | 'Asia/Jerusalem' | 'Asia/Kathmandu' | 'Asia/Kolkata' | 'Asia/Kuwait' | 'Asia/Muscat' | 'Asia/Qatar' | 'Asia/Riyadh' | 'Asia/Seoul' | 'Asia/Shanghai' | 'Asia/Singapore' | 'Asia/Taipei' | 'Asia/Tehran' | 'Asia/Tokyo' | 'Atlantic/Reykjavik' | 'Australia/ACT' | 'Australia/Adelaide' | 'Australia/Brisbane' | 'Australia/Perth' | 'Australia/Sydney' | 'Europe/Athens' | 'Europe/Belgrade' | 'Europe/Berlin' | 'Europe/Copenhagen' | 'Europe/Helsinki' | 'Europe/Istanbul' | 'Europe/London' | 'Europe/Luxembourg' | 'Europe/Madrid' | 'Europe/Moscow' | 'Europe/Oslo' | 'Europe/Paris' | 'Europe/Riga' | 'Europe/Rome' | 'Europe/Stockholm' | 'Europe/Tallinn' | 'Europe/Vilnius' | 'Europe/Warsaw' | 'Europe/Zurich' | 'Pacific/Auckland' | 'Pacific/Chatham' | 'Pacific/Fakaofo' | 'Pacific/Honolulu' | 'Pacific/Norfolk' | 'US/Mountain';

export as namespace TradingView;
