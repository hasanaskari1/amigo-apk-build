const fs=require("fs");function readMust(p){if(!fs.existsSync(p))throw new Error("PATCH: file not found: "+p);return fs.readFileSync(p,"utf8")}function replaceOnce(src,needle,repl,label){const i=src.indexOf(needle);if(i===-1)throw new Error("PATCH: anchor not found ("+label+")");if(src.indexOf(needle,i+needle.length)!==-1)throw new Error("PATCH: anchor not unique ("+label+")");return src.slice(0,i)+repl+src.slice(i+needle.length)}const CHAT="src/screens/Ghost/CrowdChatScreen.js";let chat=readMust(CHAT);const startAnchor="  // ---- Ghost media: download-to-phone -----------------------------------";const endAnchor="  const [pinnedMessage, setPinnedMessage] = useState(null);";const s1=chat.indexOf(startAnchor);const e1=chat.indexOf(endAnchor);if(s1===-1)throw new Error("PATCH: ghost media start anchor missing");if(e1===-1||e1<s1)throw new Error("PATCH: ghost media end anchor missing");const GHOST_MEDIA=["  // ---- Ghost media: single-tap download with persistent cache ----------","  // WhatsApp-style: media shows as a placeholder with ONE download icon.","  // Tapping downloads the file once (saved to the phone gallery AND kept in","  // app storage). From then on - including after app restarts - the media","  // renders directly from the local copy with no icon and no re-download.","  const [mediaLocal, setMediaLocal] = useState({});","  const mediaLocalLoadedRef = useRef(false);","","  useEffect(() => {","    if (mediaLocalLoadedRef.current) return;","    mediaLocalLoadedRef.current = true;","    (async () => {","      try {","        const raw = await AsyncStorage.getItem('ghost_media_cache_v1');","        if (raw) setMediaLocal(JSON.parse(raw));","      } catch (_) {}","    })();","  }, []);","","  const handleDownloadMedia = async (url) => {","    if (!url || downloadingMedia.has(url) || mediaLocal[url]) return;","    setDownloadingMedia((prev) => new Set(prev).add(url));","    try {","      const clean =","        ((url.split('/').pop() || 'amigo_media').split('?')[0] || 'amigo_media').replace(","          /[^\\w.\\-]/g,","          '_',","        ) || 'amigo_media';","      const dir = FileSystem.documentDirectory || FileSystem.cacheDirectory || '';","      if (!dir) { setToastMsg('Storage unavailable'); return; }","      const localUri = dir + 'ghostmedia_' + clean;","      const res = await FileSystem.downloadAsync(toSafeMediaUrl(url), localUri);","      try {","        const perm = await MediaLibrary.requestPermissionsAsync();","        if (perm.granted) await MediaLibrary.saveToLibraryAsync(res.uri);","      } catch (_) {}","      const next = { ...mediaLocal, [url]: res.uri };","      setMediaLocal(next);","      try { await AsyncStorage.setItem('ghost_media_cache_v1', JSON.stringify(next)); } catch (_) {}","      setToastMsg('Saved to your phone');","    } catch (e) {","      setToastMsg('Could not download media');","    } finally {","      setDownloadingMedia((prev) => {","        const n = new Set(prev);","        n.delete(url);","        return n;","      });","    }","  };","","  // Placeholder (one icon) until downloaded; afterwards the local copy","  // renders directly - no icon, no re-download, survives app restarts.","  // Own messages (isOwn) always render directly: the sender already has","  // the file, so no download step is shown for their own media.","  const renderGhostMedia = (url, kind, isOwn) => {","    const localUri = mediaLocal[url];","    const busy = downloadingMedia.has(url);","    if (!localUri && !isOwn) {","      return (","        <View style={styles.mediaWrapper}>","          <TouchableOpacity","            style={[styles.messageMedia, styles.mediaPlaceholder]}","            onPress={() => handleDownloadMedia(url)}","            activeOpacity={0.85}>","            {busy ? (",'              <ActivityIndicator size="small" color="#FFFFFF" />',"            ) : (","              <View style={styles.mediaPlaceholderInner}>","                <View style={styles.mediaPlaceholderIcon}>","                  <DownloadIcon width={22} height={22} />","                </View>","                <Text style={styles.mediaPlaceholderText}>{kind === 'image' ? 'Photo' : 'Video'}</Text>","                <Text style={styles.mediaPlaceholderHint}>Tap to download</Text>","              </View>","            )}","          </TouchableOpacity>","        </View>","      );","    }","    const shownUri = localUri || url;","    return (","      <View style={styles.mediaWrapper}>","        {kind === 'image' ? (","          <TouchableOpacity onPress={() => setSelectedImageUri(shownUri)} activeOpacity={0.9}>",'            <Image source={{ uri: shownUri }} style={styles.messageMedia} resizeMode="cover" />',"          </TouchableOpacity>","        ) : (","          <VideoMessage uri={shownUri} />","        )}","      </View>","    );","  };",""].join("\n");chat=chat.slice(0,s1)+GHOST_MEDIA+chat.slice(e1);const STYLE_ANCHOR="  mediaWrapper: {";const NEW_STYLES=["  mediaPlaceholder: {","    backgroundColor: 'rgba(0,0,0,0.35)',","    alignItems: 'center',","    justifyContent: 'center',","    borderWidth: 1,","    borderColor: 'rgba(255,255,255,0.12)',","  },","  mediaPlaceholderInner: {","    alignItems: 'center',","    justifyContent: 'center',","  },","  mediaPlaceholderIcon: {","    width: 44,","    height: 44,","    borderRadius: 22,","    backgroundColor: 'rgba(0,0,0,0.55)',","    alignItems: 'center',","    justifyContent: 'center',","    marginBottom: 8,","  },","  mediaPlaceholderText: {","    color: '#FFFFFF',","    fontSize: 13,","    fontWeight: '600',","  },","  mediaPlaceholderHint: {","    color: 'rgba(255,255,255,0.7)',","    fontSize: 11,","    marginTop: 2,","  },",""].join("\n");chat=replaceOnce(chat,STYLE_ANCHOR,NEW_STYLES+STYLE_ANCHOR,"mediaWrapper style");const OWN_CALLS=["            {hasMedia && isImage && renderGhostMedia(message.media, 'image')}","            {isAudio && <AudioMessage uri={message.media} isCurrentUser={true} />}","            {isVideo && renderGhostMedia(message.media, 'video')}"].join("\n");const OWN_CALLS_NEW=["            {hasMedia && isImage && renderGhostMedia(message.media, 'image', true)}","            {isAudio && <AudioMessage uri={message.media} isCurrentUser={true} />}","            {isVideo && renderGhostMedia(message.media, 'video', true)}"].join("\n");chat=replaceOnce(chat,OWN_CALLS,OWN_CALLS_NEW,"own-message media calls");fs.writeFileSync(CHAT,chat);const COMP="src/component/chat-component/index.tsx";let comp=readMust(COMP);const IMPORT_ANCHOR="import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';";comp=replaceOnce(comp,IMPORT_ANCHOR,IMPORT_ANCHOR+"\nimport AsyncStorage from '@react-native-async-storage/async-storage';","react import");const MSG_ANCHOR="  const [msg, setMsg] = useState('');";const DRAFT_BLOCK=[MSG_ANCHOR,"","  // ---- Draft message saving (DMs / Groups / Channels) --------------------","  // Purely local input-state persistence - does not touch the message send","  // or encryption flow. If the user leaves the chat with unsent text, the","  // draft is restored on return; it clears naturally once the message is","  // sent (send handlers reset msg to empty, which removes the stored draft).","  const draftRoomId = itemData?.conversationId || itemData?._id || itemData?.id || '';","  const draftLoadedRef = useRef(false);","  useEffect(() => {","    if (!draftRoomId || draftLoadedRef.current) return;","    draftLoadedRef.current = true;","    (async () => {","      try {","        const d = await AsyncStorage.getItem('chat_draft_' + draftRoomId);","        if (d) setMsg((prev) => (prev && prev.length ? prev : d));","      } catch (_) {}","    })();","  }, [draftRoomId]);","  useEffect(() => {","    if (!draftRoomId) return;","    const t = setTimeout(() => {","      try {","        if (msg && msg.trim().length) {","          AsyncStorage.setItem('chat_draft_' + draftRoomId, msg);","        } else {","          AsyncStorage.removeItem('chat_draft_' + draftRoomId);","        }","      } catch (_) {}","    }, 300);","    return () => clearTimeout(t);","  }, [msg, draftRoomId]);"].join("\n");comp=replaceOnce(comp,MSG_ANCHOR,DRAFT_BLOCK,"msg state");fs.writeFileSync(COMP,comp);const DOC="src/utils/openDocument.ts";let doc=readMust(DOC);const LOCAL_ANCHOR="    const localUri = (FileSystem.cacheDirectory || '') + cleanName;";const LOCAL_REPL=["    const baseDir = FileSystem.cacheDirectory || FileSystem.documentDirectory || '';","    if (!baseDir) {","      Alert.alert('Error', 'Storage unavailable on this device.');","      return;","    }","    const localUri = baseDir + cleanName;"].join("\n");doc=replaceOnce(doc,LOCAL_ANCHOR,LOCAL_REPL,"openDocument localUri");const UTI_ANCHOR="        UTI: undefined,";const UTI_REPL="        UTI: utiFromName(cleanName),";doc=replaceOnce(doc,UTI_ANCHOR,UTI_REPL,"openDocument UTI");const MIME_IMPORT_ANCHOR="import {mimeFromName} from './mediaUrl';";const UTI_HELPER=[MIME_IMPORT_ANCHOR,"","// iOS Uniform Type Identifier for common document types. Supplying the UTI","// lets the iOS share sheet identify the file so Quick Look previews it","// directly instead of only offering an app-selection list.","const utiFromName = (name: string): string | undefined => {","  const ext = (name.split('.').pop() || '').toLowerCase();","  const map: {[k: string]: string} = {","    pdf: 'com.adobe.pdf',","    doc: 'com.microsoft.word.doc',","    docx: 'org.openxmlformats.wordprocessingml.document',","    xls: 'com.microsoft.excel.xls',","    xlsx: 'org.openxmlformats.spreadsheetml.sheet',","    ppt: 'com.microsoft.powerpoint.ppt',","    pptx: 'org.openxmlformats.presentationml.presentation',","    txt: 'public.plain-text',","    csv: 'public.comma-separated-values-text',","    png: 'public.png',","    jpg: 'public.jpeg',","    jpeg: 'public.jpeg',","    gif: 'com.compuserve.gif',","    mp4: 'public.mpeg-4',","    mov: 'com.apple.quicktime-movie',","    mp3: 'public.mp3',","    zip: 'public.zip-archive',","  };","  return map[ext];","};"].join("\n");doc=replaceOnce(doc,MIME_IMPORT_ANCHOR,UTI_HELPER,"mime import");fs.writeFileSync(DOC,doc);console.log("PATCH v2: ghost media cache + app-wide drafts + doc-open hardening applied");const PLIST="ios/Amigo/Info.plist";const IOS_VERSION="1.5";const IOS_BUILD="56";if(fs.existsSync(PLIST)){let plist=fs.readFileSync(PLIST,"utf8");const re=/(<key>CFBundleVersion<\/key>\s*<string>)[^<]*(<\/string>)/;if(!re.test(plist))throw new Error("PATCH: CFBundleVersion not found in Info.plist");plist=plist.replace(re,"$1"+IOS_BUILD+"$2");const reSV=/(<key>CFBundleShortVersionString<\/key>\s*<string>)[^<]*(<\/string>)/;if(!reSV.test(plist))throw new Error("PATCH: CFBundleShortVersionString not found in Info.plist");plist=plist.replace(reSV,"$1"+IOS_VERSION+"$2");fs.writeFileSync(PLIST,plist);console.log("PATCH: iOS version -> "+IOS_VERSION+" ("+IOS_BUILD+")")}const GRADLE="android/app/build.gradle";const ANDROID_VC="19";if(fs.existsSync(GRADLE)){let g=fs.readFileSync(GRADLE,"utf8");const reVC=/versionCode\s+\d+/;if(!reVC.test(g))throw new Error("PATCH: versionCode not found in build.gradle");g=g.replace(reVC,"versionCode "+ANDROID_VC);fs.writeFileSync(GRADLE,g);console.log("PATCH: Android versionCode -> "+ANDROID_VC)}{const MODE="src/screens/Ghost/ChooseModeScreen.js";let mode=readMust(MODE);mode=replaceOnce(mode,"const SHOW_LOGIN_FLOW = true;","const SHOW_LOGIN_FLOW = false;","SHOW_LOGIN_FLOW");fs.writeFileSync(MODE,mode);console.log("PATCH: SHOW_LOGIN_FLOW -> false (store build)")}const ENTITLEMENTS="ios/Amigo/Amigo.entitlements";if(fs.existsSync(ENTITLEMENTS)){let ent=readMust(ENTITLEMENTS);if(ent.includes("<string>development</string>")){ent=replaceOnce(ent,"<string>development</string>","<string>production</string>","aps-environment");fs.writeFileSync(ENTITLEMENTS,ent);console.log("PATCH: aps-environment -> production (iOS push fix)")}}if(fs.existsSync(PLIST)){let plist2=fs.readFileSync(PLIST,"utf8");if(!plist2.includes("ITSAppUsesNonExemptEncryption")){plist2=replaceOnce(plist2,"	<key>CFBundleVersion</key>","	<key>ITSAppUsesNonExemptEncryption</key>\n	<false/>\n	<key>CFBundleVersion</key>","compliance key");fs.writeFileSync(PLIST,plist2);console.log("PATCH: ITSAppUsesNonExemptEncryption=false added")}}{const CHAT2="src/screens/Ghost/CrowdChatScreen.js";let c2=readMust(CHAT2);c2=replaceOnce(c2,"        // Get crowd info to determine if user is creator/admin and chat lock status\n        const crowdInfoResponse = await getCrowdInfo(crowdId, id);",["        // Get crowd info to determine if user is creator/admin and chat lock status.","        // Offline-safe: a network failure must NOT abort the mount flow, otherwise","        // cached messages never render. Fall through with status 0 instead.","        let crowdInfoResponse = { status: 0, data: null };","        try {","          crowdInfoResponse = await getCrowdInfo(crowdId, id);","        } catch (_) {}"].join("\n"),"crowdInfo offline guard");c2=replaceOnce(c2,"  const [typingUsers, setTypingUsers] = useState([]);",["  const [typingUsers, setTypingUsers] = useState([]);","","  // Keep the local message cache fresh: whenever messages change (socket","  // receives, deletes, blocks), persist the latest 50 real messages so they","  // are available instantly - and offline - on the next open.","  useEffect(() => {","    if (!crowdId || !messages.length) return;","    const t = setTimeout(() => {","      try {","        const real = messages.filter(m => m && m.messageId && !String(m.messageId).startsWith('temp_') && m.messageId !== 'history_expiration_system');","        if (real.length) AsyncStorage.setItem('ghost_msgs_' + crowdId, JSON.stringify(real.slice(-50)));","      } catch (_) {}","    }, 500);","    return () => clearTimeout(t);","  }, [messages, crowdId]);"].join("\n"),"message cache keep-fresh");fs.writeFileSync(CHAT2,c2);console.log("PATCH: ghost chat offline cache hardened")}{const MEM="src/screens/Ghost/CrowdMembersScreen.js";let mem=readMust(MEM);mem=replaceOnce(mem,"import { getCrowdMembers, updateAdminStatus, removeMember } from '../../apis/ghost';","import { getCrowdMembers, updateAdminStatus, removeMember } from '../../apis/ghost';\nimport AsyncStorage from '@react-native-async-storage/async-storage';","members AsyncStorage import");mem=replaceOnce(mem,"  const [members, setMembers] = useState([]);","  const [members, setMembers] = useState([]);\n  const [visibleMembersCount, setVisibleMembersCount] = useState(50);","members visible count state");mem=replaceOnce(mem,"        const response = await getCrowdMembers(crowdId, id);",["        // Local cache: show the last known members list instantly (and offline)","        // while the fresh list is fetched in the background.","        try {","          const cachedRaw = await AsyncStorage.getItem('ghost_members_' + crowdId);","          if (cachedRaw) {","            const cachedList = JSON.parse(cachedRaw);","            if (Array.isArray(cachedList) && cachedList.length > 0) {","              setMembers(cachedList.map(m => ({ ...m, joinedAt: new Date(m.joinedAt), isCurrentUser: m.deviceId === id })));","              cachedList.forEach(m => { if (m.deviceId === id) { setCurrentUserIsAdmin(!!m.isAdmin); setCurrentUserIsCreator(!!m.isCreator); } });","              setIsLoading(false);","            }","          }","        } catch (_) {}","","        const response = await getCrowdMembers(crowdId, id);"].join("\n"),"members cache hydrate");mem=replaceOnce(mem,"          setMembers(updatedMembers);","          setMembers(updatedMembers);\n          try { AsyncStorage.setItem('ghost_members_' + crowdId, JSON.stringify(updatedMembers)); } catch (_) {}","members cache write");mem=replaceOnce(mem,"            members.map(renderMember)",["            <>","              {members.slice(0, visibleMembersCount).map(renderMember)}","              {members.length > visibleMembersCount && (","                <TouchableOpacity","                  style={styles.loadMoreButton}","                  onPress={() => setVisibleMembersCount(c => c + 50)}","                  activeOpacity={0.8}>","                  <Text style={styles.loadMoreText}>","                    Load more ({members.length - visibleMembersCount} remaining)","                  </Text>","                </TouchableOpacity>","              )}","            </>"].join("\n"),"members paginated render");mem=replaceOnce(mem,"  memberCount: {",["  loadMoreButton: {","    marginTop: 12,","    marginBottom: 8,","    paddingVertical: 12,","    borderRadius: 12,","    backgroundColor: 'rgba(155,123,255,0.12)',","    alignItems: 'center',","  },","  loadMoreText: {","    color: '#9B7BFF',","    fontSize: 14,","    fontWeight: '600',","  },","  memberCount: {"].join("\n"),"members loadMore styles");fs.writeFileSync(MEM,mem);console.log("PATCH: crowd members cache + pagination added")}{const HOME="src/screens/Ghost/GhostModeHomeScreen.js";let home=readMust(HOME);home=replaceOnce(home,"import { getActiveCrowds, getCrowdInfo } from '../../apis/ghost';","import { getActiveCrowds, getCrowdInfo } from '../../apis/ghost';\nimport AsyncStorage from '@react-native-async-storage/async-storage';","home AsyncStorage import");home=replaceOnce(home,"      const response = await getActiveCrowds(deviceId);\n\n      if (response.status === 200 && response.data) {\n        _crowdsCache = response.data;\n        setActiveCrowds(response.data);\n      }",["      // Local cache: show the last known crowds instantly (works offline and","      // across app restarts) while a fresh list is fetched in the background.","      if (_crowdsCache.length === 0) {","        try {","          const cachedRaw = await AsyncStorage.getItem('ghost_crowds_cache_v1');","          if (cachedRaw) {","            const cachedList = JSON.parse(cachedRaw);","            if (Array.isArray(cachedList) && cachedList.length > 0) {","              _crowdsCache = cachedList;","              setActiveCrowds(cachedList);","              setIsLoading(false);","            }","          }","        } catch (_) {}","      }","","      const response = await getActiveCrowds(deviceId);","","      if (response.status === 200 && response.data) {","        _crowdsCache = response.data;","        setActiveCrowds(response.data);","        try { AsyncStorage.setItem('ghost_crowds_cache_v1', JSON.stringify(response.data)); } catch (_) {}","      }"].join("\n"),"active crowds cache");fs.writeFileSync(HOME,home);console.log("PATCH: active crowds persistent cache added")}{const CHAT3="src/screens/Ghost/CrowdChatScreen.js";let c3=readMust(CHAT3);c3=replaceOnce(c3,"        let crowdInfoResponse = { status: 0, data: null };",["        // Instant cache render: show cached messages BEFORE any network call","        // or socket wait, so the chat opens immediately - and offline - on","        // all platforms. loadMessages() later refreshes from the API.","        try {","          const cachedRaw0 = await AsyncStorage.getItem('ghost_msgs_' + crowdId);","          if (cachedRaw0) {","            const cached0 = JSON.parse(cachedRaw0);","            if (Array.isArray(cached0) && cached0.length > 0) {","              setMessages(prev => (prev.length ? prev : cached0.map(m => ({ ...m, timestamp: new Date(m.timestamp) }))));","              setIsLoadingMessages(false);","            }","          }","        } catch (_) {}","","        let crowdInfoResponse = { status: 0, data: null };"].join("\n"),"instant cache render");c3=replaceOnce(c3,"    } catch (error) {\n      console.error('Error loading more messages:', error);\n    } finally {\n      setIsLoadingMore(false);\n    }",["    } catch (error) {","      console.error('Error loading more messages:', error);","      // Offline/failed fetch: stop retrying until the chat is reopened -","      // prevents the endless spinner blink when onEndReached keeps firing","      // on a short cached list while the network is unavailable.","      hasMoreMessagesRef.current = false;","      setHasMoreMessages(false);","    } finally {","      setIsLoadingMore(false);","    }"].join("\n"),"load-more retry stop");fs.writeFileSync(CHAT3,c3);console.log("PATCH: ghost chat instant cache render + load-more retry stop")}{const WALLET="src/screen/wallet-screen/index.tsx";let w=readMust(WALLET);w=replaceOnce(w,"import Reanimated, { Layout } from 'react-native-reanimated';","import Reanimated, { LinearTransition } from 'react-native-reanimated';","wallet reanimated import");w=replaceOnce(w,"                  layout={Layout.springify()}","                  layout={LinearTransition.springify()}","wallet layout prop");fs.writeFileSync(WALLET,w);console.log("PATCH: wallet Reanimated v4 crash fixed (Layout -> LinearTransition)")}{const WALLET2="src/screen/wallet-screen/index.tsx";let w2=readMust(WALLET2);w2=replaceOnce(w2,"import Reanimated, { LinearTransition } from 'react-native-reanimated';\n","","wallet reanimated import removal");w2=replaceOnce(w2,"const AnimatedPressable = Reanimated.createAnimatedComponent(Pressable);\n","","wallet AnimatedPressable removal");w2=replaceOnce(w2,"                <AnimatedPressable\n                  layout={LinearTransition.springify()}\n","                <Pressable\n","wallet item opening tag");w2=replaceOnce(w2,"                </AnimatedPressable>","                </Pressable>","wallet item closing tag");fs.writeFileSync(WALLET2,w2);console.log("PATCH: wallet layout animation removed (reanimated-free wallet)")}{const NAV="src/navigation/index.tsx";let nav=readMust(NAV);const STUB=["    NotificationListener((data: any) => {","      if (data?.chatType && data?.chatId) {","        // Navigate based on notification data","        console.log('Navigate to chat:', data);","      }","    });"].join("\n");const REAL=["    NotificationListener((data: any) => {","      console.log('Notification tapped, payload:', JSON.stringify(data || {}));","      try {","        // Ghost crowd push: accept any key spelling the backend may use.","        const crowdId =","          data?.crowdId || data?.crowd_id || data?.crowdID ||","          (data?.type === 'crowd' || data?.chatType === 'crowd' ? data?.chatId || data?.id : null);","        if (crowdId) {","          const crowdName = data?.crowdName || data?.crowd_name || data?.title || '';","          // Ghost identity comes from local storage so the chat screen","          // opens fully populated exactly like tapping the crowd tile.","          getGhostLogin()","            .then((g: any) => openCrowdFromNotification(String(crowdId), crowdName, g))","            .catch(() => openCrowdFromNotification(String(crowdId), crowdName, null));","          return;","        }","      } catch (_) {}","    });"].join("\n");nav=replaceOnce(nav,STUB,REAL,"notification tap stub");if(!/import\s*\{[^}]*getGhostLogin[^}]*\}\s*from/.test(nav)){throw new Error("PATCH: expected getGhostLogin import missing from navigator")}fs.writeFileSync(NAV,nav);console.log("PATCH: notification tap now opens the crowd (was a console.log stub)")}{const WALLET3="src/screen/wallet-screen/index.tsx";let w3=readMust(WALLET3);w3=replaceOnce(w3,"const WalletScreen = () => {",["// Crash containment: any render/lifecycle error inside the wallet is","// caught here and shown on screen instead of taking the whole app down.","class WalletErrorBoundary extends React.Component {","  constructor(props) {","    super(props);","    this.state = { error: null };","  }","  static getDerivedStateFromError(error) {","    return { error };","  }","  componentDidCatch(error, info) {","    console.log('WALLET ERROR:', String(error), info && info.componentStack);","  }","  render() {","    if (this.state.error) {","      return (","        <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A14' }}>","          <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>","            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>","              Wallet could not open","            </Text>","            <Text selectable style={{ color: '#FF8A8A', fontSize: 13, marginBottom: 16 }}>","              {String(this.state.error && this.state.error.message ? this.state.error.message : this.state.error)}","            </Text>","            <Text style={{ color: '#8B8CAD', fontSize: 12 }}>","              Please screenshot this screen and send it to the developer.","            </Text>","          </View>","        </SafeAreaView>","      );","    }","    return this.props.children;","  }","}","","const WalletScreenInner = () => {"].join("\n"),"wallet error boundary class");w3=replaceOnce(w3,"export default WalletScreen;",["const WalletScreen = () => (","  <WalletErrorBoundary>","    <WalletScreenInner />","  </WalletErrorBoundary>",");","","export default WalletScreen;"].join("\n"),"wallet boundary wrapper");fs.writeFileSync(WALLET3,w3);console.log("PATCH: wallet wrapped in error boundary (shows real error instead of crashing)")}{const MISSING=[{file:"src/screen/wallet-screen/index.tsx",find:"  Pressable,\n  ScrollView,\n",repl:"  Pressable,\n  ScrollView,\n  TouchableOpacity,\n",what:"wallet TouchableOpacity (CONFIRMED crash)"},{file:"src/screen/create-group-channel/group-type/index.tsx",find:"import { Pressable,  View } from 'react-native'\n",repl:"import { Pressable,  View } from 'react-native'\nimport { SafeAreaView } from 'react-native-safe-area-context'\n",what:"group/channel type screen SafeAreaView"},{file:"src/screen/profile/dm-profile-screen/profileview.tsx",find:"import { Image, Platform, Pressable,  TouchableOpacity, View } from 'react-native'\n",repl:"import { Image, Platform, Pressable,  TouchableOpacity, View } from 'react-native'\nimport { SafeAreaView } from 'react-native-safe-area-context'\n",what:"DM profile SafeAreaView"},{file:"src/screen/shareit-screen/index.tsx",find:"import { Animated, Dimensions, FlatList, Linking, Modal, Platform, Pressable,  TouchableOpacity, View } from 'react-native'\n",repl:"import { Animated, Dimensions, FlatList, Linking, Modal, Platform, Pressable,  TouchableOpacity, View } from 'react-native'\nimport { SafeAreaView } from 'react-native-safe-area-context'\n",what:"ShareIt screen SafeAreaView"},{file:"src/screens/Chanel/ChanelChatBox.js",find:"import { SafeAreaView } from 'react-native-safe-area-context';\n",repl:"import { SafeAreaView } from 'react-native-safe-area-context';\nimport RNVoiceMessagePlayer from '@carchaze/react-native-voice-message-player';\n",what:"channel chat voice player"},{file:"src/screens/Group/GroupChatBox.js",find:"import { SafeAreaView } from 'react-native-safe-area-context';\n",repl:"import { SafeAreaView } from 'react-native-safe-area-context';\nimport RNVoiceMessagePlayer from '@carchaze/react-native-voice-message-player';\n",what:"group chat voice player"}];MISSING.forEach(({file,find,repl,what})=>{let s=readMust(file);s=replaceOnce(s,find,repl,`missing import: ${what}`);fs.writeFileSync(file,s);console.log(`PATCH: added missing import -> ${what}`)})}{const NAV2="src/navigation/index.tsx";let n2=readMust(NAV2);n2=replaceOnce(n2,"import { NotificationListener, removeNotificationListeners, requestUserPermission } from '../utils/notification';","import { NotificationListener, removeNotificationListeners, requestUserPermission, clearBadgeCount } from '../utils/notification';","badge import");n2=replaceOnce(n2,["    const handleAppStateChange = (nextAppState: string) => {","      if (nextAppState === 'background' && socketServics.getConnectionStatus()) {","        socketServics.emit('Disconnect');","      }","    };"].join("\n"),["    const handleAppStateChange = (nextAppState: string) => {","      if (nextAppState === 'background' && socketServics.getConnectionStatus()) {","        socketServics.emit('Disconnect');","      }","      if (nextAppState === 'active') {","        // Opening / returning to the app means the user has seen it.","        clearBadgeCount();","      }","    };","    // Already foregrounded at mount (e.g. cold start from a notification).","    clearBadgeCount();"].join("\n"),"badge clear on foreground");fs.writeFileSync(NAV2,n2);console.log("PATCH: app-icon badge now clears on foreground (was never cleared)")}{const RULES_PATH="src/screens/Ghost/GhostRulesScreen.js";const RULES_SRC=`import React from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { FontFamily } from '../../../GlobalStyles';
import useScreenEnterAnimations, {
  useStaggeredListEnter,
} from '../../hooks/useScreenEnterAnimations';
import BackArrow from '../../assets/svg/backArrow';
import ClockIcon from '../../assets/svg/ClockIcon';
import DeleteBinIcon from '../../assets/svg/DeleteBinIcon';
import LockIcon from '../../assets/svg/LockIcon';
import GhostIcon from '../../assets/svg/GhostIcon';

// Two small inline icons so the stroke colour can be driven per-rule. The
// shipped AddIcon / ShareImageIcon hard-code a purple stroke and cannot be
// recoloured, and the design needs purple and green respectively.
const PlusCircleIcon = ({ size = 22, color = '#9B7BFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9.5} stroke={color} strokeWidth={1.8} />
    <Path
      d="M8 12h8M12 8v8"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);

const MediaIcon = ({ size = 22, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x={3}
      y={3}
      width={18}
      height={18}
      rx={3}
      stroke={color}
      strokeWidth={1.8}
    />
    <Circle cx={8.5} cy={8.5} r={1.6} stroke={color} strokeWidth={1.8} />
    <Path
      d="M21 15.5l-4.5-4.5L6 21"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const AddUserIcon = ({ size = 22, color = '#60A5FA' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={9} cy={8} r={3.6} stroke={color} strokeWidth={1.8} />
    <Path
      d="M2.8 20c0-3.3 2.8-5.6 6.2-5.6 1.3 0 2.5.3 3.5.9"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Path
      d="M18 13.4v5.2M15.4 16h5.2"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);

// Static screen: text and icons only, no state and no side effects.
const RULES = [
  {
    key: 'crowd-creation',
    color: '#9B7BFF',
    title: 'Crowd Creation',
    description: 'You can create up to 3 Crowds per day.',
    render: (color) => <PlusCircleIcon color={color} />,
  },
  {
    key: 'temporary',
    color: '#60A5FA',
    title: 'Crowds Are Temporary',
    description: 'Every Crowd automatically expires after its set duration.',
    render: (color) => <ClockIcon width={22} height={22} strokeColor={color} />,
  },
  {
    key: 'deleted',
    color: '#FF6B6B',
    title: 'Expired Crowds Are Deleted',
    description:
      'When a Crowd expires, everything inside it \u2014 including messages and media \u2014 is permanently deleted.',
    render: (color) => (
      <DeleteBinIcon width={22} height={22} strokeColor={color} />
    ),
  },
  {
    key: 'media',
    color: '#22C55E',
    title: 'Media Sharing',
    description:
      'Only Crowd admins can send photos, videos, and other media files.',
    render: (color) => <MediaIcon color={color} />,
  },
  {
    key: 'chat-lock',
    color: '#F5A623',
    title: 'Chat Lock',
    description:
      'Admins can lock the Crowd chat. When the chat is locked, only admins can send messages.',
    render: (color) => <LockIcon width={22} height={22} strokeColor={color} />,
  },
  {
    key: 'ghost-identity',
    color: '#9B7BFF',
    title: 'Ghost Identity After Logout',
    description:
      'When you log out of Ghost Mode, your Ghost identity will remain available only if you still have an active Crowd that you created or joined.',
    description2:
      'If you have no active Crowds, your Ghost identity will be removed.',
    render: (color) => <GhostIcon width={22} height={22} strokeColor={color} />,
  },
  {
    key: 'new-ghost-identity',
    color: '#60A5FA',
    title: 'Creating a New Ghost Identity',
    description:
      'If your Ghost identity has been removed, you will need to create a new Ghost identity with a new name the next time you use Ghost Mode.',
    render: (color) => <AddUserIcon color={color} />,
  },
];

const GhostRulesScreen = ({ navigation }) => {
  // Client asked for an animation when the screen opens. Uses the app's own
  // enter-animation hooks (same system as Settings and Contact List) so the
  // motion matches the rest of the app: the hero fades and lifts, then the
  // rule cards stagger in one after another.
  const { headerStyle, titleStyle } = useScreenEnterAnimations({
    headerDelayMs: 0,
    titleDelayMs: 120,
    contentBaseDelayMs: 220,
    durationMs: 520,
  });
  const ruleEnterStyles = useStaggeredListEnter(RULES.length, {
    baseDelayMs: 320,
    stepMs: 70,
    offsetX: 0,
  });

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.View style={[styles.header, headerStyle]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <BackArrow color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.hero, titleStyle]}>
            <View style={styles.heroTile}>
              <GhostIcon width={46} height={46} strokeColor="#9B7BFF" />
            </View>
            <Text style={styles.heroSubtitle}>
              Understand how Ghost Mode works so you can use it safely and
              effectively.
            </Text>
          </Animated.View>

          <View style={styles.rulesContainer}>
            {RULES.map((rule, index) => (
              <Animated.View
                key={rule.key}
                style={[styles.ruleCard, ruleEnterStyles[index]]}>
                <LinearGradient
                  colors={[rule.color, \`\${rule.color}55\`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.accentStripe}
                />
                <View style={styles.ruleInner}>
                  <View
                    style={[
                      styles.ruleIconTile,
                      { backgroundColor: \`\${rule.color}24\` },
                    ]}>
                    {rule.render(rule.color)}
                  </View>
                  <View style={styles.ruleContent}>
                    <Text style={styles.ruleTitle}>{rule.title}</Text>
                    <Text style={styles.ruleDescription}>
                      {rule.description}
                    </Text>
                    {rule.description2 ? (
                      <Text
                        style={[
                          styles.ruleDescription,
                          styles.ruleDescriptionSpaced,
                        ]}>
                        {rule.description2}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>

          <Animated.View
            style={[
              styles.footerCard,
              ruleEnterStyles[RULES.length - 1],
            ]}>
            <Text style={styles.footerText}>
              Ghost Mode is designed for{' '}
              <Text style={styles.footerHighlight}>temporary, anonymous</Text>{' '}
              communication. Stay safe and respect others.
            </Text>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0B0B12' },
  container: { flex: 1, backgroundColor: '#0B0B12' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButton: { padding: 4 },
  scrollContent: { paddingHorizontal: 18, paddingBottom: 48 },
  hero: { alignItems: 'center', marginTop: 12, marginBottom: 26 },
  heroTile: {
    width: 96,
    height: 96,
    borderRadius: 26,
    backgroundColor: 'rgba(155, 123, 255, 0.13)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#C9CDD6',
    textAlign: 'center',
    lineHeight: 23,
    paddingHorizontal: 14,
    fontFamily: FontFamily.interRegular,
  },
  rulesContainer: {},
  ruleCard: {
    backgroundColor: '#16161E',
    borderRadius: 14,
    marginBottom: 14,
    overflow: 'hidden',
  },
  accentStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  ruleInner: { flexDirection: 'row', padding: 16, paddingLeft: 20 },
  ruleIconTile: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  ruleContent: { flex: 1, paddingTop: 2 },
  ruleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
    fontFamily: FontFamily.interRegular,
  },
  ruleDescription: {
    fontSize: 14,
    color: '#9AA0AE',
    lineHeight: 21,
    fontFamily: FontFamily.interRegular,
  },
  ruleDescriptionSpaced: { marginTop: 12 },
  footerCard: {
    marginTop: 8,
    backgroundColor: '#14141C',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  footerText: {
    fontSize: 14,
    color: '#9AA0AE',
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: FontFamily.interRegular,
  },
  footerHighlight: { color: '#9B7BFF', fontWeight: '600' },
});

export default GhostRulesScreen;
`;fs.writeFileSync(RULES_PATH,RULES_SRC);console.log("PATCH: created GhostRulesScreen.js");const NAV3="src/navigation/index.tsx";let n3=readMust(NAV3);n3=replaceOnce(n3,"import GhostSettingsScreen from '../screens/Ghost/GhostSettingsScreen';","import GhostSettingsScreen from '../screens/Ghost/GhostSettingsScreen';\nimport GhostRulesScreen from '../screens/Ghost/GhostRulesScreen';","ghost rules import");n3=replaceOnce(n3,["      <Stack.Screen","        name={'GhostSettingsScreen' as any}","        component={GhostSettingsScreen}","      />"].join("\n"),["      <Stack.Screen","        name={'GhostSettingsScreen' as any}","        component={GhostSettingsScreen}","      />","      <Stack.Screen","        name={'GhostRulesScreen' as any}","        component={GhostRulesScreen}","      />"].join("\n"),"ghost rules route");fs.writeFileSync(NAV3,n3);console.log("PATCH: registered GhostRulesScreen route");const GSET="src/screens/Ghost/GhostSettingsScreen.js";let g=readMust(GSET);g=replaceOnce(g,"          {/* Legal Section */}",["          {/* Ghost Rules Section */}","          <View style={styles.section}>","            <Text style={styles.sectionHeader}>Community</Text>","            <View style={styles.itemsContainer}>","              <SettingItem","                icon={InfoIcon}",'                iconColor="#9B7BFF"','                title="Ghost Rules"','                description="The rules every ghost agrees to follow"',"                onPress={() => navigation.navigate('GhostRulesScreen')}","              />","            </View>","          </View>","","          {/* Legal Section */}"].join("\n"),"ghost rules settings entry");fs.writeFileSync(GSET,g);console.log("PATCH: added Settings -> Ghost Rules entry")}{const NAV4="src/navigation/index.tsx";let n4=readMust(NAV4);n4=replaceOnce(n4,"import { NotificationListener, removeNotificationListeners, requestUserPermission, clearBadgeCount } from '../utils/notification';",["import { NotificationListener, removeNotificationListeners, requestUserPermission, clearBadgeCount } from '../utils/notification';","import { navigationRef as rootNavigationRef, navigateTo, resetToScreen } from '../utils/navigationRef';","","// Opening the right crowd from a notification tap.","//","// Cold start is the hard case. NavigationContainer lives in App.tsx and","// mounts immediately, so isReady() returns true almost at once - but the","// Stack inside this file renders nothing until initialRoute resolves, so","// for the first moments there are NO registered screens and a navigate()","// is silently dropped. That is why a tap worked when the app was already","// backgrounded but fell back to the crowd list from a cold start.","//","// So do not trust isReady() alone: keep going until getCurrentRoute()","// actually reports CrowdChatScreen. That also survives the splash and early","// screens calling replace() shortly after mount, which would otherwise","// wipe the navigation we just performed.","const openCrowdFromNotification = (","  crowdId: string,","  crowdName: string,","  ghost: any,","  attempt: number = 0,",") => {","  const params = {","    crowdId,","    crowdName,","    ghostName: ghost?.ghostName || '',","    avatarBgColor: ghost?.avatarBgColor || '#155DFC',","    isCreator: false,","  };","  let current: any = null;","  const ready = rootNavigationRef.isReady();","  if (ready) {","    try {","      current = rootNavigationRef.getCurrentRoute();","    } catch (_) {","      current = null;","    }","  }","  // Already there (and on the right crowd) - nothing left to do.","  if (","    current && current.name === 'CrowdChatScreen' &&","    String(current.params?.crowdId ?? '') === String(crowdId)","  ) {","    console.log('Notification tap: crowd screen is open');","    return;","  }","  // A non-null current route proves real screens are mounted.","  if (ready && current) {","    navigateTo('CrowdChatScreen', params);","  }","  if (attempt < 60) {","    setTimeout(","      () => openCrowdFromNotification(crowdId, crowdName, ghost, attempt + 1),","      300,","    );","  } else {","    console.log('Notification tap: gave up opening the crowd');","  }","};"].join("\n"),"real navigation ref import + cold-start helper");n4=replaceOnce(n4,"  const navigationRef = React.useRef<any>(null);\n","","dead local navigationRef removal");n4=replaceOnce(n4,["    setupAxiosInterceptors(() => {","      navigationRef.current?.reset({","        index: 0,","        routes: [{name: 'ChooseModeScreen'}],","      });","    });"].join("\n"),["    setupAxiosInterceptors(() => {","      resetToScreen('ChooseModeScreen');","    });"].join("\n"),"401 logout reset via real nav ref");if(/navigationRef\.current/.test(n4)){throw new Error("PATCH: a navigationRef.current usage survived - dead ref still in play")}fs.writeFileSync(NAV4,n4);console.log("PATCH: notification tap + 401 reset now use the REAL navigation ref")}{const NOTIF="src/utils/notification.ts";let nt=readMust(NOTIF);nt=replaceOnce(nt,"let foregroundFCMUnsubscribe: (() => void) | null = null;",["let foregroundFCMUnsubscribe: (() => void) | null = null;","let openedAppUnsubscribe: (() => void) | null = null;","","// A single tap can surface through more than one channel (expo listener","// and Firebase). Collapse duplicates inside a short window.",'let lastTapKey = "";',"let lastTapAt = 0;","const handleTapOnce = (data: any, onNotificationTap?: (data: any) => void) => {","  if (!onNotificationTap || !data) return;",'  let key = "";',"  try {","    key = JSON.stringify(data);","  } catch (_) {","    key = String(data);","  }","  const now = Date.now();","  if (key === lastTapKey && now - lastTapAt < 3000) return;","  lastTapKey = key;","  lastTapAt = now;","  onNotificationTap(data);","};"].join("\n"),"tap dedupe helper");nt=replaceOnce(nt,["  if (foregroundFCMUnsubscribe) {","    foregroundFCMUnsubscribe();","  }"].join("\n"),["  if (foregroundFCMUnsubscribe) {","    foregroundFCMUnsubscribe();","  }","  if (openedAppUnsubscribe) {","    openedAppUnsubscribe();","  }"].join("\n"),"cleanup opened-app subscription");nt=replaceOnce(nt,["      console.log('Notification tapped:', data);","      if (onNotificationTap) {","        onNotificationTap(data);","      }"].join("\n"),["      console.log('Notification tapped (expo):', data);","      handleTapOnce(data, onNotificationTap);"].join("\n"),"expo tap through dedupe");nt=replaceOnce(nt,"  // Check if app was opened from a notification (terminated state)",["  // iOS: Firebase owns the notification-centre delegate, so taps on remote","  // notifications arrive here rather than through expo-notifications.","  openedAppUnsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {","    console.log('FCM notification opened app:', remoteMessage);","    handleTapOnce(remoteMessage?.data, onNotificationTap);","  });","","  // Cold start: the app was launched by tapping a remote notification.","  try {","    const initialFCM = await messaging().getInitialNotification();","    if (initialFCM) {","      console.log('FCM initial notification:', initialFCM);","      handleTapOnce(initialFCM?.data, onNotificationTap);","    }","  } catch (e) {","    console.log('getInitialNotification failed:', e);","  }","","  // Check if app was opened from a notification (terminated state)"].join("\n"),"firebase tap handlers");nt=replaceOnce(nt,["    if (onNotificationTap) {","      setTimeout(() => {","        onNotificationTap(data);","      }, 1000);","    }"].join("\n"),["    handleTapOnce(data, onNotificationTap);"].join("\n"),"terminated expo tap through dedupe");nt=replaceOnce(nt,["  if (foregroundFCMUnsubscribe) {","    foregroundFCMUnsubscribe();","    foregroundFCMUnsubscribe = null;","  }"].join("\n"),["  if (foregroundFCMUnsubscribe) {","    foregroundFCMUnsubscribe();","    foregroundFCMUnsubscribe = null;","  }","  if (openedAppUnsubscribe) {","    openedAppUnsubscribe();","    openedAppUnsubscribe = null;","  }"].join("\n"),"removeNotificationListeners cleanup");fs.writeFileSync(NOTIF,nt);console.log("PATCH: iOS notification taps now handled via Firebase (background + cold start)")}{const WAPI="src/apis/wallet/index.ts";let w=readMust(WAPI);w=replaceOnce(w,"import axios from 'axios';",["import axios from 'axios';","import AsyncStorage from '@react-native-async-storage/async-storage';"].join("\n"),"wallet AsyncStorage import");w=replaceOnce(w,"const walletUrl = (path: string) => BASE_URL + WALLET_BASE + path;",["const walletUrl = (path: string) => BASE_URL + WALLET_BASE + path;","","// The IV is generated on this device at upload time. Keep our own copy so","// decryption still works if the server does not return it.","const ivKey = (id: string) => `wallet_iv_${id}`;","","export const rememberWalletIv = async (id: string, iv: string) => {","  try {","    if (id && iv) await AsyncStorage.setItem(ivKey(id), iv);","  } catch (_) {","    // non-fatal: we still have the server copy in the normal case","  }","};","","export const recallWalletIv = async (id: string): Promise<string> => {","  try {","    return (await AsyncStorage.getItem(ivKey(id))) || '';","  } catch (_) {","    return '';","  }","};"].join("\n"),"wallet iv local store");w=replaceOnce(w,["    const response = await axios.post(walletUrl(WALLET_UPLOAD), formData, {","      headers: { 'Content-Type': 'multipart/form-data' },","    });","    return response.data;"].join("\n"),["    const response = await axios.post(walletUrl(WALLET_UPLOAD), formData, {","      headers: { 'Content-Type': 'multipart/form-data' },","    });","    // Keep the IV against the new item id, so this file stays readable","    // even if the server never returns the IV to us.","    try {","      const newId =","        response?.data?.data?.id ||","        response?.data?.data?.item?.id ||","        response?.data?.id;","      if (newId) await rememberWalletIv(String(newId), ivB64);","    } catch (_) {","      // best effort","    }","    return response.data;"].join("\n"),"wallet remember iv on upload");w=replaceOnce(w,["  const iv =","    item.iv ||","    (dl.headers && (dl.headers['X-Amigo-Iv'] || dl.headers['x-amigo-iv'])) ||","    '';","  const plainB64 = await decryptWalletBase64(cipherB64, iv);"].join("\n"),["  const serverIv =","    item.iv ||","    (dl.headers && (dl.headers['X-Amigo-Iv'] || dl.headers['x-amigo-iv'])) ||","    '';","  // Fall back to the copy this device saved when it uploaded the file.","  const iv = serverIv || (await recallWalletIv(String(item.id)));","  if (!iv) {","    throw new Error(","      'Missing encryption IV for this item - it was not returned by the ' +","        'server and no local copy exists on this device, so the file ' +","        'cannot be decrypted here.',","    );","  }","  console.log('wallet decrypt: iv source =', serverIv ? 'server' : 'local');","  const plainB64 = await decryptWalletBase64(cipherB64, iv);"].join("\n"),"wallet iv resolution + explicit error");fs.writeFileSync(WAPI,w);console.log("PATCH: wallet IV now stored locally and resolved server->header->local")}
