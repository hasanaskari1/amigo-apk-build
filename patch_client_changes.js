const fs=require("fs");function readMust(p){if(!fs.existsSync(p))throw new Error("PATCH: file not found: "+p);return fs.readFileSync(p,"utf8")}function replaceOnce(src,needle,repl,label){const i=src.indexOf(needle);if(i===-1)throw new Error("PATCH: anchor not found ("+label+")");if(src.indexOf(needle,i+needle.length)!==-1)throw new Error("PATCH: anchor not unique ("+label+")");return src.slice(0,i)+repl+src.slice(i+needle.length)}const CHAT="src/screens/Ghost/CrowdChatScreen.js";let chat=readMust(CHAT);const startAnchor="  // ---- Ghost media: download-to-phone -----------------------------------";const endAnchor="  const [pinnedMessage, setPinnedMessage] = useState(null);";const s1=chat.indexOf(startAnchor);const e1=chat.indexOf(endAnchor);if(s1===-1)throw new Error("PATCH: ghost media start anchor missing");if(e1===-1||e1<s1)throw new Error("PATCH: ghost media end anchor missing");const GHOST_MEDIA=["  // ---- Ghost media: single-tap download with persistent cache ----------","  // WhatsApp-style: media shows as a placeholder with ONE download icon.","  // Tapping downloads the file once (saved to the phone gallery AND kept in","  // app storage). From then on - including after app restarts - the media","  // renders directly from the local copy with no icon and no re-download.","  const [mediaLocal, setMediaLocal] = useState({});","  const mediaLocalLoadedRef = useRef(false);","","  useEffect(() => {","    if (mediaLocalLoadedRef.current) return;","    mediaLocalLoadedRef.current = true;","    (async () => {","      try {","        const raw = await AsyncStorage.getItem('ghost_media_cache_v1');","        if (raw) setMediaLocal(JSON.parse(raw));","      } catch (_) {}","    })();","  }, []);","","  const handleDownloadMedia = async (url) => {","    if (!url || downloadingMedia.has(url) || mediaLocal[url]) return;","    setDownloadingMedia((prev) => new Set(prev).add(url));","    try {","      const clean =","        ((url.split('/').pop() || 'amigo_media').split('?')[0] || 'amigo_media').replace(","          /[^\\w.\\-]/g,","          '_',","        ) || 'amigo_media';","      const dir = FileSystem.documentDirectory || FileSystem.cacheDirectory || '';","      if (!dir) { setToastMsg('Storage unavailable'); return; }","      const localUri = dir + 'ghostmedia_' + clean;","      const res = await FileSystem.downloadAsync(toSafeMediaUrl(url), localUri);","      try {","        const perm = await MediaLibrary.requestPermissionsAsync();","        if (perm.granted) await MediaLibrary.saveToLibraryAsync(res.uri);","      } catch (_) {}","      const next = { ...mediaLocal, [url]: res.uri };","      setMediaLocal(next);","      try { await AsyncStorage.setItem('ghost_media_cache_v1', JSON.stringify(next)); } catch (_) {}","      setToastMsg('Saved to your phone');","    } catch (e) {","      setToastMsg('Could not download media');","    } finally {","      setDownloadingMedia((prev) => {","        const n = new Set(prev);","        n.delete(url);","        return n;","      });","    }","  };","","  // Placeholder (one icon) until downloaded; afterwards the local copy","  // renders directly - no icon, no re-download, survives app restarts.","  // Own messages (isOwn) always render directly: the sender already has","  // the file, so no download step is shown for their own media.","  const renderGhostMedia = (url, kind, isOwn) => {","    const localUri = mediaLocal[url];","    const busy = downloadingMedia.has(url);","    if (!localUri && !isOwn) {","      return (","        <View style={styles.mediaWrapper}>","          <TouchableOpacity","            style={[styles.messageMedia, styles.mediaPlaceholder]}","            onPress={() => handleDownloadMedia(url)}","            activeOpacity={0.85}>","            {busy ? (",'              <ActivityIndicator size="small" color="#FFFFFF" />',"            ) : (","              <View style={styles.mediaPlaceholderInner}>","                <View style={styles.mediaPlaceholderIcon}>","                  <DownloadIcon width={22} height={22} />","                </View>","                <Text style={styles.mediaPlaceholderText}>{kind === 'image' ? 'Photo' : 'Video'}</Text>","                <Text style={styles.mediaPlaceholderHint}>Tap to download</Text>","              </View>","            )}","          </TouchableOpacity>","        </View>","      );","    }","    const shownUri = localUri || url;","    return (","      <View style={styles.mediaWrapper}>","        {kind === 'image' ? (","          <TouchableOpacity onPress={() => setSelectedImageUri(shownUri)} activeOpacity={0.9}>",'            <Image source={{ uri: shownUri }} style={styles.messageMedia} resizeMode="cover" />',"          </TouchableOpacity>","        ) : (","          <VideoMessage uri={shownUri} />","        )}","      </View>","    );","  };",""].join("\n");chat=chat.slice(0,s1)+GHOST_MEDIA+chat.slice(e1);const STYLE_ANCHOR="  mediaWrapper: {";const NEW_STYLES=["  mediaPlaceholder: {","    backgroundColor: 'rgba(0,0,0,0.35)',","    alignItems: 'center',","    justifyContent: 'center',","    borderWidth: 1,","    borderColor: 'rgba(255,255,255,0.12)',","  },","  mediaPlaceholderInner: {","    alignItems: 'center',","    justifyContent: 'center',","  },","  mediaPlaceholderIcon: {","    width: 44,","    height: 44,","    borderRadius: 22,","    backgroundColor: 'rgba(0,0,0,0.55)',","    alignItems: 'center',","    justifyContent: 'center',","    marginBottom: 8,","  },","  mediaPlaceholderText: {","    color: '#FFFFFF',","    fontSize: 13,","    fontWeight: '600',","  },","  mediaPlaceholderHint: {","    color: 'rgba(255,255,255,0.7)',","    fontSize: 11,","    marginTop: 2,","  },",""].join("\n");chat=replaceOnce(chat,STYLE_ANCHOR,NEW_STYLES+STYLE_ANCHOR,"mediaWrapper style");const OWN_CALLS=["            {hasMedia && isImage && renderGhostMedia(message.media, 'image')}","            {isAudio && <AudioMessage uri={message.media} isCurrentUser={true} />}","            {isVideo && renderGhostMedia(message.media, 'video')}"].join("\n");const OWN_CALLS_NEW=["            {hasMedia && isImage && renderGhostMedia(message.media, 'image', true)}","            {isAudio && <AudioMessage uri={message.media} isCurrentUser={true} />}","            {isVideo && renderGhostMedia(message.media, 'video', true)}"].join("\n");chat=replaceOnce(chat,OWN_CALLS,OWN_CALLS_NEW,"own-message media calls");fs.writeFileSync(CHAT,chat);const COMP="src/component/chat-component/index.tsx";let comp=readMust(COMP);const IMPORT_ANCHOR="import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';";comp=replaceOnce(comp,IMPORT_ANCHOR,IMPORT_ANCHOR+"\nimport AsyncStorage from '@react-native-async-storage/async-storage';","react import");const MSG_ANCHOR="  const [msg, setMsg] = useState('');";const DRAFT_BLOCK=[MSG_ANCHOR,"","  // ---- Draft message saving (DMs / Groups / Channels) --------------------","  // Purely local input-state persistence - does not touch the message send","  // or encryption flow. If the user leaves the chat with unsent text, the","  // draft is restored on return; it clears naturally once the message is","  // sent (send handlers reset msg to empty, which removes the stored draft).","  const draftRoomId = itemData?.conversationId || itemData?._id || itemData?.id || '';","  const draftLoadedRef = useRef(false);","  useEffect(() => {","    if (!draftRoomId || draftLoadedRef.current) return;","    draftLoadedRef.current = true;","    (async () => {","      try {","        const d = await AsyncStorage.getItem('chat_draft_' + draftRoomId);","        if (d) setMsg((prev) => (prev && prev.length ? prev : d));","      } catch (_) {}","    })();","  }, [draftRoomId]);","  useEffect(() => {","    if (!draftRoomId) return;","    const t = setTimeout(() => {","      try {","        if (msg && msg.trim().length) {","          AsyncStorage.setItem('chat_draft_' + draftRoomId, msg);","        } else {","          AsyncStorage.removeItem('chat_draft_' + draftRoomId);","        }","      } catch (_) {}","    }, 300);","    return () => clearTimeout(t);","  }, [msg, draftRoomId]);"].join("\n");comp=replaceOnce(comp,MSG_ANCHOR,DRAFT_BLOCK,"msg state");fs.writeFileSync(COMP,comp);const DOC="src/utils/openDocument.ts";let doc=readMust(DOC);const LOCAL_ANCHOR="    const localUri = (FileSystem.cacheDirectory || '') + cleanName;";const LOCAL_REPL=["    const baseDir = FileSystem.cacheDirectory || FileSystem.documentDirectory || '';","    if (!baseDir) {","      Alert.alert('Error', 'Storage unavailable on this device.');","      return;","    }","    const localUri = baseDir + cleanName;"].join("\n");doc=replaceOnce(doc,LOCAL_ANCHOR,LOCAL_REPL,"openDocument localUri");const UTI_ANCHOR="        UTI: undefined,";const UTI_REPL="        UTI: utiFromName(cleanName),";doc=replaceOnce(doc,UTI_ANCHOR,UTI_REPL,"openDocument UTI");const MIME_IMPORT_ANCHOR="import {mimeFromName} from './mediaUrl';";const UTI_HELPER=[MIME_IMPORT_ANCHOR,"","// iOS Uniform Type Identifier for common document types. Supplying the UTI","// lets the iOS share sheet identify the file so Quick Look previews it","// directly instead of only offering an app-selection list.","const utiFromName = (name: string): string | undefined => {","  const ext = (name.split('.').pop() || '').toLowerCase();","  const map: {[k: string]: string} = {","    pdf: 'com.adobe.pdf',","    doc: 'com.microsoft.word.doc',","    docx: 'org.openxmlformats.wordprocessingml.document',","    xls: 'com.microsoft.excel.xls',","    xlsx: 'org.openxmlformats.spreadsheetml.sheet',","    ppt: 'com.microsoft.powerpoint.ppt',","    pptx: 'org.openxmlformats.presentationml.presentation',","    txt: 'public.plain-text',","    csv: 'public.comma-separated-values-text',","    png: 'public.png',","    jpg: 'public.jpeg',","    jpeg: 'public.jpeg',","    gif: 'com.compuserve.gif',","    mp4: 'public.mpeg-4',","    mov: 'com.apple.quicktime-movie',","    mp3: 'public.mp3',","    zip: 'public.zip-archive',","  };","  return map[ext];","};"].join("\n");doc=replaceOnce(doc,MIME_IMPORT_ANCHOR,UTI_HELPER,"mime import");fs.writeFileSync(DOC,doc);console.log("PATCH v2: ghost media cache + app-wide drafts + doc-open hardening applied");const PLIST="ios/Amigo/Info.plist";const IOS_VERSION="1.5";const IOS_BUILD="67";if(fs.existsSync(PLIST)){let plist=fs.readFileSync(PLIST,"utf8");const re=/(<key>CFBundleVersion<\/key>\s*<string>)[^<]*(<\/string>)/;if(!re.test(plist))throw new Error("PATCH: CFBundleVersion not found in Info.plist");plist=plist.replace(re,"$1"+IOS_BUILD+"$2");const reSV=/(<key>CFBundleShortVersionString<\/key>\s*<string>)[^<]*(<\/string>)/;if(!reSV.test(plist))throw new Error("PATCH: CFBundleShortVersionString not found in Info.plist");plist=plist.replace(reSV,"$1"+IOS_VERSION+"$2");fs.writeFileSync(PLIST,plist);console.log("PATCH: iOS version -> "+IOS_VERSION+" ("+IOS_BUILD+")")}const GRADLE="android/app/build.gradle";const ANDROID_VC="30";if(fs.existsSync(GRADLE)){let g=fs.readFileSync(GRADLE,"utf8");const reVC=/versionCode\s+\d+/;if(!reVC.test(g))throw new Error("PATCH: versionCode not found in build.gradle");g=g.replace(reVC,"versionCode "+ANDROID_VC);fs.writeFileSync(GRADLE,g);console.log("PATCH: Android versionCode -> "+ANDROID_VC)}{const MODE="src/screens/Ghost/ChooseModeScreen.js";let mode=readMust(MODE);if(mode.indexOf("const SHOW_LOGIN_FLOW = true;")===-1)throw new Error("PATCH: SHOW_LOGIN_FLOW anchor missing - expected it to be true for the OTP build");console.log("PATCH: SHOW_LOGIN_FLOW left TRUE (OTP/login build)")}const ENTITLEMENTS="ios/Amigo/Amigo.entitlements";if(fs.existsSync(ENTITLEMENTS)){let ent=readMust(ENTITLEMENTS);if(ent.includes("<string>development</string>")){ent=replaceOnce(ent,"<string>development</string>","<string>production</string>","aps-environment");fs.writeFileSync(ENTITLEMENTS,ent);console.log("PATCH: aps-environment -> production (iOS push fix)")}}if(fs.existsSync(PLIST)){let plist2=fs.readFileSync(PLIST,"utf8");if(!plist2.includes("ITSAppUsesNonExemptEncryption")){plist2=replaceOnce(plist2,"	<key>CFBundleVersion</key>","	<key>ITSAppUsesNonExemptEncryption</key>\n	<false/>\n	<key>CFBundleVersion</key>","compliance key");fs.writeFileSync(PLIST,plist2);console.log("PATCH: ITSAppUsesNonExemptEncryption=false added")}}{const CHAT2="src/screens/Ghost/CrowdChatScreen.js";let c2=readMust(CHAT2);c2=replaceOnce(c2,"        // Get crowd info to determine if user is creator/admin and chat lock status\n        const crowdInfoResponse = await getCrowdInfo(crowdId, id);",["        // Get crowd info to determine if user is creator/admin and chat lock status.","        // Offline-safe: a network failure must NOT abort the mount flow, otherwise","        // cached messages never render. Fall through with status 0 instead.","        let crowdInfoResponse = { status: 0, data: null };","        try {","          crowdInfoResponse = await getCrowdInfo(crowdId, id);","        } catch (_) {}"].join("\n"),"crowdInfo offline guard");c2=replaceOnce(c2,"  const [typingUsers, setTypingUsers] = useState([]);",["  const [typingUsers, setTypingUsers] = useState([]);","","  // Keep the local message cache fresh: whenever messages change (socket","  // receives, deletes, blocks), persist the latest 50 real messages so they","  // are available instantly - and offline - on the next open.","  useEffect(() => {","    if (!crowdId || !messages.length) return;","    const t = setTimeout(() => {","      try {","        const real = messages.filter(m => m && m.messageId && !String(m.messageId).startsWith('temp_') && m.messageId !== 'history_expiration_system');","        if (real.length) AsyncStorage.setItem('ghost_msgs_' + crowdId, JSON.stringify(real.slice(-50)));","      } catch (_) {}","    }, 500);","    return () => clearTimeout(t);","  }, [messages, crowdId]);"].join("\n"),"message cache keep-fresh");fs.writeFileSync(CHAT2,c2);console.log("PATCH: ghost chat offline cache hardened")}{const MEM="src/screens/Ghost/CrowdMembersScreen.js";let mem=readMust(MEM);mem=replaceOnce(mem,"import { getCrowdMembers, updateAdminStatus, removeMember } from '../../apis/ghost';","import { getCrowdMembers, updateAdminStatus, removeMember } from '../../apis/ghost';\nimport AsyncStorage from '@react-native-async-storage/async-storage';","members AsyncStorage import");mem=replaceOnce(mem,"  const [members, setMembers] = useState([]);","  const [members, setMembers] = useState([]);\n  const [visibleMembersCount, setVisibleMembersCount] = useState(50);","members visible count state");mem=replaceOnce(mem,"        const response = await getCrowdMembers(crowdId, id);",["        // Local cache: show the last known members list instantly (and offline)","        // while the fresh list is fetched in the background.","        try {","          const cachedRaw = await AsyncStorage.getItem('ghost_members_' + crowdId);","          if (cachedRaw) {","            const cachedList = JSON.parse(cachedRaw);","            if (Array.isArray(cachedList) && cachedList.length > 0) {","              setMembers(cachedList.map(m => ({ ...m, joinedAt: new Date(m.joinedAt), isCurrentUser: m.deviceId === id })));","              cachedList.forEach(m => { if (m.deviceId === id) { setCurrentUserIsAdmin(!!m.isAdmin); setCurrentUserIsCreator(!!m.isCreator); } });","              setIsLoading(false);","            }","          }","        } catch (_) {}","","        const response = await getCrowdMembers(crowdId, id);"].join("\n"),"members cache hydrate");mem=replaceOnce(mem,"          setMembers(updatedMembers);","          setMembers(updatedMembers);\n          try { AsyncStorage.setItem('ghost_members_' + crowdId, JSON.stringify(updatedMembers)); } catch (_) {}","members cache write");mem=replaceOnce(mem,"            members.map(renderMember)",["            <>","              {members.slice(0, visibleMembersCount).map(renderMember)}","              {members.length > visibleMembersCount && (","                <TouchableOpacity","                  style={styles.loadMoreButton}","                  onPress={() => setVisibleMembersCount(c => c + 50)}","                  activeOpacity={0.8}>","                  <Text style={styles.loadMoreText}>","                    Load more ({members.length - visibleMembersCount} remaining)","                  </Text>","                </TouchableOpacity>","              )}","            </>"].join("\n"),"members paginated render");mem=replaceOnce(mem,"  memberCount: {",["  loadMoreButton: {","    marginTop: 12,","    marginBottom: 8,","    paddingVertical: 12,","    borderRadius: 12,","    backgroundColor: 'rgba(155,123,255,0.12)',","    alignItems: 'center',","  },","  loadMoreText: {","    color: '#9B7BFF',","    fontSize: 14,","    fontWeight: '600',","  },","  memberCount: {"].join("\n"),"members loadMore styles");fs.writeFileSync(MEM,mem);console.log("PATCH: crowd members cache + pagination added")}{const HOME="src/screens/Ghost/GhostModeHomeScreen.js";let home=readMust(HOME);home=replaceOnce(home,"import { getActiveCrowds, getCrowdInfo } from '../../apis/ghost';","import { getActiveCrowds, getCrowdInfo } from '../../apis/ghost';\nimport AsyncStorage from '@react-native-async-storage/async-storage';","home AsyncStorage import");home=replaceOnce(home,"      const response = await getActiveCrowds(deviceId);\n\n      if (response.status === 200 && response.data) {\n        _crowdsCache = response.data;\n        setActiveCrowds(response.data);\n      }",["      // Local cache: show the last known crowds instantly (works offline and","      // across app restarts) while a fresh list is fetched in the background.","      if (_crowdsCache.length === 0) {","        try {","          const cachedRaw = await AsyncStorage.getItem('ghost_crowds_cache_v1');","          if (cachedRaw) {","            const cachedList = JSON.parse(cachedRaw);","            if (Array.isArray(cachedList) && cachedList.length > 0) {","              _crowdsCache = cachedList;","              setActiveCrowds(cachedList);","              setIsLoading(false);","            }","          }","        } catch (_) {}","      }","","      const response = await getActiveCrowds(deviceId);","","      if (response.status === 200 && response.data) {","        _crowdsCache = response.data;","        setActiveCrowds(response.data);","        try { AsyncStorage.setItem('ghost_crowds_cache_v1', JSON.stringify(response.data)); } catch (_) {}","      }"].join("\n"),"active crowds cache");fs.writeFileSync(HOME,home);console.log("PATCH: active crowds persistent cache added")}{const CHAT3="src/screens/Ghost/CrowdChatScreen.js";let c3=readMust(CHAT3);c3=replaceOnce(c3,"        let crowdInfoResponse = { status: 0, data: null };",["        // Instant cache render: show cached messages BEFORE any network call","        // or socket wait, so the chat opens immediately - and offline - on","        // all platforms. loadMessages() later refreshes from the API.","        try {","          const cachedRaw0 = await AsyncStorage.getItem('ghost_msgs_' + crowdId);","          if (cachedRaw0) {","            const cached0 = JSON.parse(cachedRaw0);","            if (Array.isArray(cached0) && cached0.length > 0) {","              setMessages(prev => (prev.length ? prev : cached0.map(m => ({ ...m, timestamp: new Date(m.timestamp) }))));","              setIsLoadingMessages(false);","            }","          }","        } catch (_) {}","","        let crowdInfoResponse = { status: 0, data: null };"].join("\n"),"instant cache render");c3=replaceOnce(c3,"    } catch (error) {\n      console.error('Error loading more messages:', error);\n    } finally {\n      setIsLoadingMore(false);\n    }",["    } catch (error) {","      console.error('Error loading more messages:', error);","      // Offline/failed fetch: stop retrying until the chat is reopened -","      // prevents the endless spinner blink when onEndReached keeps firing","      // on a short cached list while the network is unavailable.","      hasMoreMessagesRef.current = false;","      setHasMoreMessages(false);","    } finally {","      setIsLoadingMore(false);","    }"].join("\n"),"load-more retry stop");fs.writeFileSync(CHAT3,c3);console.log("PATCH: ghost chat instant cache render + load-more retry stop")}{const WALLET="src/screen/wallet-screen/index.tsx";let w=readMust(WALLET);w=replaceOnce(w,"import Reanimated, { Layout } from 'react-native-reanimated';","import Reanimated, { LinearTransition } from 'react-native-reanimated';","wallet reanimated import");w=replaceOnce(w,"                  layout={Layout.springify()}","                  layout={LinearTransition.springify()}","wallet layout prop");fs.writeFileSync(WALLET,w);console.log("PATCH: wallet Reanimated v4 crash fixed (Layout -> LinearTransition)")}{const WALLET2="src/screen/wallet-screen/index.tsx";let w2=readMust(WALLET2);w2=replaceOnce(w2,"import Reanimated, { LinearTransition } from 'react-native-reanimated';\n","","wallet reanimated import removal");w2=replaceOnce(w2,"const AnimatedPressable = Reanimated.createAnimatedComponent(Pressable);\n","","wallet AnimatedPressable removal");w2=replaceOnce(w2,"                <AnimatedPressable\n                  layout={LinearTransition.springify()}\n","                <Pressable\n","wallet item opening tag");w2=replaceOnce(w2,"                </AnimatedPressable>","                </Pressable>","wallet item closing tag");fs.writeFileSync(WALLET2,w2);console.log("PATCH: wallet layout animation removed (reanimated-free wallet)")}{const NAV="src/navigation/index.tsx";let nav=readMust(NAV);const STUB=["    NotificationListener((data: any) => {","      if (data?.chatType && data?.chatId) {","        // Navigate based on notification data","        console.log('Navigate to chat:', data);","      }","    });"].join("\n");const REAL=["    NotificationListener((data: any) => {","      console.log('Notification tapped, payload:', JSON.stringify(data || {}));","      try {","        // Ghost crowd push: accept any key spelling the backend may use.","        const crowdId =","          data?.crowdId || data?.crowd_id || data?.crowdID ||","          (data?.type === 'crowd' || data?.chatType === 'crowd' ? data?.chatId || data?.id : null);","        if (crowdId) {","          const crowdName = data?.crowdName || data?.crowd_name || data?.title || '';","          // Ghost identity comes from local storage so the chat screen","          // opens fully populated exactly like tapping the crowd tile.","          getGhostLogin()","            .then((g: any) => openCrowdFromNotification(String(crowdId), crowdName, g))","            .catch(() => openCrowdFromNotification(String(crowdId), crowdName, null));","          return;","        }","      } catch (_) {}","    });"].join("\n");nav=replaceOnce(nav,STUB,REAL,"notification tap stub");if(!/import\s*\{[^}]*getGhostLogin[^}]*\}\s*from/.test(nav)){throw new Error("PATCH: expected getGhostLogin import missing from navigator")}fs.writeFileSync(NAV,nav);console.log("PATCH: notification tap now opens the crowd (was a console.log stub)")}{const WALLET3="src/screen/wallet-screen/index.tsx";let w3=readMust(WALLET3);w3=replaceOnce(w3,"const WalletScreen = () => {",["// Crash containment: any render/lifecycle error inside the wallet is","// caught here and shown on screen instead of taking the whole app down.","class WalletErrorBoundary extends React.Component {","  constructor(props) {","    super(props);","    this.state = { error: null };","  }","  static getDerivedStateFromError(error) {","    return { error };","  }","  componentDidCatch(error, info) {","    console.log('WALLET ERROR:', String(error), info && info.componentStack);","  }","  render() {","    if (this.state.error) {","      return (","        <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A14' }}>","          <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>","            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>","              Wallet could not open","            </Text>","            <Text selectable style={{ color: '#FF8A8A', fontSize: 13, marginBottom: 16 }}>","              {String(this.state.error && this.state.error.message ? this.state.error.message : this.state.error)}","            </Text>","            <Text style={{ color: '#8B8CAD', fontSize: 12 }}>","              Please screenshot this screen and send it to the developer.","            </Text>","          </View>","        </SafeAreaView>","      );","    }","    return this.props.children;","  }","}","","const WalletScreenInner = () => {"].join("\n"),"wallet error boundary class");w3=replaceOnce(w3,"export default WalletScreen;",["const WalletScreen = () => (","  <WalletErrorBoundary>","    <WalletScreenInner />","  </WalletErrorBoundary>",");","","export default WalletScreen;"].join("\n"),"wallet boundary wrapper");fs.writeFileSync(WALLET3,w3);console.log("PATCH: wallet wrapped in error boundary (shows real error instead of crashing)")}{const MISSING=[{file:"src/screen/wallet-screen/index.tsx",find:"  Pressable,\n  ScrollView,\n",repl:"  Pressable,\n  ScrollView,\n  TouchableOpacity,\n",what:"wallet TouchableOpacity (CONFIRMED crash)"},{file:"src/screen/create-group-channel/group-type/index.tsx",find:"import { Pressable,  View } from 'react-native'\n",repl:"import { Pressable,  View } from 'react-native'\nimport { SafeAreaView } from 'react-native-safe-area-context'\n",what:"group/channel type screen SafeAreaView"},{file:"src/screen/profile/dm-profile-screen/profileview.tsx",find:"import { Image, Platform, Pressable,  TouchableOpacity, View } from 'react-native'\n",repl:"import { Image, Platform, Pressable,  TouchableOpacity, View } from 'react-native'\nimport { SafeAreaView } from 'react-native-safe-area-context'\n",what:"DM profile SafeAreaView"},{file:"src/screen/shareit-screen/index.tsx",find:"import { Animated, Dimensions, FlatList, Linking, Modal, Platform, Pressable,  TouchableOpacity, View } from 'react-native'\n",repl:"import { Animated, Dimensions, FlatList, Linking, Modal, Platform, Pressable,  TouchableOpacity, View } from 'react-native'\nimport { SafeAreaView } from 'react-native-safe-area-context'\n",what:"ShareIt screen SafeAreaView"},{file:"src/screens/Chanel/ChanelChatBox.js",find:"import { SafeAreaView } from 'react-native-safe-area-context';\n",repl:"import { SafeAreaView } from 'react-native-safe-area-context';\nimport RNVoiceMessagePlayer from '@carchaze/react-native-voice-message-player';\n",what:"channel chat voice player"},{file:"src/screens/Group/GroupChatBox.js",find:"import { SafeAreaView } from 'react-native-safe-area-context';\n",repl:"import { SafeAreaView } from 'react-native-safe-area-context';\nimport RNVoiceMessagePlayer from '@carchaze/react-native-voice-message-player';\n",what:"group chat voice player"}];MISSING.forEach(({file,find,repl,what})=>{let s=readMust(file);s=replaceOnce(s,find,repl,`missing import: ${what}`);fs.writeFileSync(file,s);console.log(`PATCH: added missing import -> ${what}`)})}{const NAV2="src/navigation/index.tsx";let n2=readMust(NAV2);n2=replaceOnce(n2,"import { NotificationListener, removeNotificationListeners, requestUserPermission } from '../utils/notification';","import { NotificationListener, removeNotificationListeners, requestUserPermission, clearBadgeCount } from '../utils/notification';","badge import");n2=replaceOnce(n2,["    const handleAppStateChange = (nextAppState: string) => {","      if (nextAppState === 'background' && socketServics.getConnectionStatus()) {","        socketServics.emit('Disconnect');","      }","    };"].join("\n"),["    const handleAppStateChange = (nextAppState: string) => {","      if (nextAppState === 'background' && socketServics.getConnectionStatus()) {","        socketServics.emit('Disconnect');","      }","      if (nextAppState === 'active') {","        // Opening / returning to the app means the user has seen it.","        clearBadgeCount();","      }","    };","    // Already foregrounded at mount (e.g. cold start from a notification).","    clearBadgeCount();"].join("\n"),"badge clear on foreground");fs.writeFileSync(NAV2,n2);console.log("PATCH: app-icon badge now clears on foreground (was never cleared)")}{const RULES_PATH="src/screens/Ghost/GhostRulesScreen.js";const RULES_SRC=`import React from 'react';
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
`;fs.writeFileSync(RULES_PATH,RULES_SRC);console.log("PATCH: created GhostRulesScreen.js");const NAV3="src/navigation/index.tsx";let n3=readMust(NAV3);n3=replaceOnce(n3,"import GhostSettingsScreen from '../screens/Ghost/GhostSettingsScreen';","import GhostSettingsScreen from '../screens/Ghost/GhostSettingsScreen';\nimport GhostRulesScreen from '../screens/Ghost/GhostRulesScreen';","ghost rules import");n3=replaceOnce(n3,["      <Stack.Screen","        name={'GhostSettingsScreen' as any}","        component={GhostSettingsScreen}","      />"].join("\n"),["      <Stack.Screen","        name={'GhostSettingsScreen' as any}","        component={GhostSettingsScreen}","      />","      <Stack.Screen","        name={'GhostRulesScreen' as any}","        component={GhostRulesScreen}","      />"].join("\n"),"ghost rules route");fs.writeFileSync(NAV3,n3);console.log("PATCH: registered GhostRulesScreen route");const GSET="src/screens/Ghost/GhostSettingsScreen.js";let g=readMust(GSET);g=replaceOnce(g,"          {/* Legal Section */}",["          {/* Ghost Rules Section */}","          <View style={styles.section}>","            <Text style={styles.sectionHeader}>Community</Text>","            <View style={styles.itemsContainer}>","              <SettingItem","                icon={InfoIcon}",'                iconColor="#9B7BFF"','                title="Ghost Rules"','                description="The rules every ghost agrees to follow"',"                onPress={() => navigation.navigate('GhostRulesScreen')}","              />","            </View>","          </View>","","          {/* Legal Section */}"].join("\n"),"ghost rules settings entry");fs.writeFileSync(GSET,g);console.log("PATCH: added Settings -> Ghost Rules entry")}{const NAV4="src/navigation/index.tsx";let n4=readMust(NAV4);n4=replaceOnce(n4,"import { NotificationListener, removeNotificationListeners, requestUserPermission, clearBadgeCount } from '../utils/notification';",["import { NotificationListener, removeNotificationListeners, requestUserPermission, clearBadgeCount } from '../utils/notification';","import { navigationRef as rootNavigationRef, navigateTo, resetToScreen } from '../utils/navigationRef';","","// Opening the right crowd from a notification tap.","//","// Cold start is the hard case. NavigationContainer lives in App.tsx and","// mounts immediately, so isReady() returns true almost at once - but the","// Stack inside this file renders nothing until initialRoute resolves, so","// for the first moments there are NO registered screens and a navigate()","// is silently dropped. That is why a tap worked when the app was already","// backgrounded but fell back to the crowd list from a cold start.","//","// So do not trust isReady() alone: keep going until getCurrentRoute()","// actually reports CrowdChatScreen. That also survives the splash and early","// screens calling replace() shortly after mount, which would otherwise","// wipe the navigation we just performed.","const openCrowdFromNotification = (","  crowdId: string,","  crowdName: string,","  ghost: any,","  attempt: number = 0,",") => {","  const params = {","    crowdId,","    crowdName,","    ghostName: ghost?.ghostName || '',","    avatarBgColor: ghost?.avatarBgColor || '#155DFC',","    isCreator: false,","  };","  let current: any = null;","  const ready = rootNavigationRef.isReady();","  if (ready) {","    try {","      current = rootNavigationRef.getCurrentRoute();","    } catch (_) {","      current = null;","    }","  }","  // Already there (and on the right crowd) - nothing left to do.","  if (","    current && current.name === 'CrowdChatScreen' &&","    String(current.params?.crowdId ?? '') === String(crowdId)","  ) {","    console.log('Notification tap: crowd screen is open');","    return;","  }","  // A non-null current route proves real screens are mounted.","  if (ready && current) {","    navigateTo('CrowdChatScreen', params);","  }","  if (attempt < 60) {","    setTimeout(","      () => openCrowdFromNotification(crowdId, crowdName, ghost, attempt + 1),","      300,","    );","  } else {","    console.log('Notification tap: gave up opening the crowd');","  }","};"].join("\n"),"real navigation ref import + cold-start helper");n4=replaceOnce(n4,"  const navigationRef = React.useRef<any>(null);\n","","dead local navigationRef removal");n4=replaceOnce(n4,["    setupAxiosInterceptors(() => {","      navigationRef.current?.reset({","        index: 0,","        routes: [{name: 'ChooseModeScreen'}],","      });","    });"].join("\n"),["    setupAxiosInterceptors(() => {","      resetToScreen('ChooseModeScreen');","    });"].join("\n"),"401 logout reset via real nav ref");if(/navigationRef\.current/.test(n4)){throw new Error("PATCH: a navigationRef.current usage survived - dead ref still in play")}fs.writeFileSync(NAV4,n4);console.log("PATCH: notification tap + 401 reset now use the REAL navigation ref")}{const NOTIF="src/utils/notification.ts";let nt=readMust(NOTIF);nt=replaceOnce(nt,"let foregroundFCMUnsubscribe: (() => void) | null = null;",["let foregroundFCMUnsubscribe: (() => void) | null = null;","let openedAppUnsubscribe: (() => void) | null = null;","","// A single tap can surface through more than one channel (expo listener","// and Firebase). Collapse duplicates inside a short window.",'let lastTapKey = "";',"let lastTapAt = 0;","const handleTapOnce = (data: any, onNotificationTap?: (data: any) => void) => {","  if (!onNotificationTap || !data) return;",'  let key = "";',"  try {","    key = JSON.stringify(data);","  } catch (_) {","    key = String(data);","  }","  const now = Date.now();","  if (key === lastTapKey && now - lastTapAt < 3000) return;","  lastTapKey = key;","  lastTapAt = now;","  onNotificationTap(data);","};"].join("\n"),"tap dedupe helper");nt=replaceOnce(nt,["  if (foregroundFCMUnsubscribe) {","    foregroundFCMUnsubscribe();","  }"].join("\n"),["  if (foregroundFCMUnsubscribe) {","    foregroundFCMUnsubscribe();","  }","  if (openedAppUnsubscribe) {","    openedAppUnsubscribe();","  }"].join("\n"),"cleanup opened-app subscription");nt=replaceOnce(nt,["      console.log('Notification tapped:', data);","      if (onNotificationTap) {","        onNotificationTap(data);","      }"].join("\n"),["      console.log('Notification tapped (expo):', data);","      handleTapOnce(data, onNotificationTap);"].join("\n"),"expo tap through dedupe");nt=replaceOnce(nt,"  // Check if app was opened from a notification (terminated state)",["  // iOS: Firebase owns the notification-centre delegate, so taps on remote","  // notifications arrive here rather than through expo-notifications.","  openedAppUnsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {","    console.log('FCM notification opened app:', remoteMessage);","    handleTapOnce(remoteMessage?.data, onNotificationTap);","  });","","  // Cold start: the app was launched by tapping a remote notification.","  try {","    const initialFCM = await messaging().getInitialNotification();","    if (initialFCM) {","      console.log('FCM initial notification:', initialFCM);","      handleTapOnce(initialFCM?.data, onNotificationTap);","    }","  } catch (e) {","    console.log('getInitialNotification failed:', e);","  }","","  // Check if app was opened from a notification (terminated state)"].join("\n"),"firebase tap handlers");nt=replaceOnce(nt,["    if (onNotificationTap) {","      setTimeout(() => {","        onNotificationTap(data);","      }, 1000);","    }"].join("\n"),["    handleTapOnce(data, onNotificationTap);"].join("\n"),"terminated expo tap through dedupe");nt=replaceOnce(nt,["  if (foregroundFCMUnsubscribe) {","    foregroundFCMUnsubscribe();","    foregroundFCMUnsubscribe = null;","  }"].join("\n"),["  if (foregroundFCMUnsubscribe) {","    foregroundFCMUnsubscribe();","    foregroundFCMUnsubscribe = null;","  }","  if (openedAppUnsubscribe) {","    openedAppUnsubscribe();","    openedAppUnsubscribe = null;","  }"].join("\n"),"removeNotificationListeners cleanup");fs.writeFileSync(NOTIF,nt);console.log("PATCH: iOS notification taps now handled via Firebase (background + cold start)")}{const WAPI="src/apis/wallet/index.ts";let w=readMust(WAPI);w=replaceOnce(w,"import axios from 'axios';",["import axios from 'axios';","import AsyncStorage from '@react-native-async-storage/async-storage';"].join("\n"),"wallet AsyncStorage import");w=replaceOnce(w,"const walletUrl = (path: string) => BASE_URL + WALLET_BASE + path;",["const walletUrl = (path: string) => BASE_URL + WALLET_BASE + path;","","// The IV is generated on this device at upload time. Keep our own copy so","// decryption still works if the server does not return it.","const ivKey = (id: string) => `wallet_iv_${id}`;","","export const rememberWalletIv = async (id: string, iv: string) => {","  try {","    if (id && iv) await AsyncStorage.setItem(ivKey(id), iv);","  } catch (_) {","    // non-fatal: we still have the server copy in the normal case","  }","};","","export const recallWalletIv = async (id: string): Promise<string> => {","  try {","    return (await AsyncStorage.getItem(ivKey(id))) || '';","  } catch (_) {","    return '';","  }","};"].join("\n"),"wallet iv local store");w=replaceOnce(w,["    const response = await axios.post(walletUrl(WALLET_UPLOAD), formData, {","      headers: { 'Content-Type': 'multipart/form-data' },","    });","    return response.data;"].join("\n"),["    const response = await axios.post(walletUrl(WALLET_UPLOAD), formData, {","      headers: { 'Content-Type': 'multipart/form-data' },","    });","    // Keep the IV against the new item id, so this file stays readable","    // even if the server never returns the IV to us.","    try {","      const newId =","        response?.data?.data?.id ||","        response?.data?.data?.item?.id ||","        response?.data?.id;","      if (newId) await rememberWalletIv(String(newId), ivB64);","    } catch (_) {","      // best effort","    }","    return response.data;"].join("\n"),"wallet remember iv on upload");w=replaceOnce(w,["  const iv =","    item.iv ||","    (dl.headers && (dl.headers['X-Amigo-Iv'] || dl.headers['x-amigo-iv'])) ||","    '';","  const plainB64 = await decryptWalletBase64(cipherB64, iv);"].join("\n"),["  const serverIv =","    item.iv ||","    (dl.headers && (dl.headers['X-Amigo-Iv'] || dl.headers['x-amigo-iv'])) ||","    '';","  // Fall back to the copy this device saved when it uploaded the file.","  const iv = serverIv || (await recallWalletIv(String(item.id)));","  if (!iv) {","    throw new Error(","      'Missing encryption IV for this item - it was not returned by the ' +","        'server and no local copy exists on this device, so the file ' +","        'cannot be decrypted here.',","    );","  }","  console.log('wallet decrypt: iv source =', serverIv ? 'server' : 'local');","  const plainB64 = await decryptWalletBase64(cipherB64, iv);"].join("\n"),"wallet iv resolution + explicit error");fs.writeFileSync(WAPI,w);console.log("PATCH: wallet IV now stored locally and resolved server->header->local")}{const PEND="src/utils/pendingCrowd.ts";fs.writeFileSync(PEND,["import AsyncStorage from '@react-native-async-storage/async-storage';","","// A crowd we were told to open by a notification tap, held until a screen","// is actually mounted and able to navigate. Survives the whole cold-start","// boot sequence, which is what the navigator-race approach could not do.","const KEY = 'pending_crowd_open_v1';","const MAX_AGE_MS = 2 * 60 * 1000;","","// Pull a crowd id out of a push payload whatever shape it arrives in.","export const extractCrowdId = (data: any): string | null => {","  if (!data) return null;","  const KEYS = ['crowdId', 'crowd_id', 'crowdID', 'crowdid'];","  const seen = new Set<any>();","  const walk = (node: any, depth: number): string | null => {","    if (!node || depth > 5 || typeof node !== 'object') return null;","    if (seen.has(node)) return null;","    seen.add(node);","    for (const k of KEYS) {","      const v = (node as any)[k];","      if (v !== undefined && v !== null && String(v) !== '') return String(v);","    }","    const type = (node as any).type || (node as any).chatType;","    if (type === 'crowd') {","      const v = (node as any).chatId ?? (node as any).id;","      if (v !== undefined && v !== null && String(v) !== '') return String(v);","    }","    for (const k of Object.keys(node)) {","      const child = (node as any)[k];","      if (child && typeof child === 'object') {","        const found = walk(child, depth + 1);","        if (found) return found;","      }","      if (typeof child === 'string' && child.trim().startsWith('{')) {","        try {","          const found = walk(JSON.parse(child), depth + 1);","          if (found) return found;","        } catch (_) {}","      }","    }","    return null;","  };","  try {","    return walk(data, 0);","  } catch (_) {","    return null;","  }","};","","export const extractCrowdName = (data: any): string => {","  try {","    return String(","      data?.crowdName || data?.crowd_name || data?.title || '',","    );","  } catch (_) {","    return '';","  }","};","","export type PendingCrowd = { crowdId: string; crowdName: string };","","// In-memory mirror. The tap can be delivered either before or after the","// home screen mounts, and AsyncStorage is async, so a storage-only design","// still loses the race in one of those two orderings. Memory + listener","// closes it: whoever arrives second is the one that acts.","let memoryPending: (PendingCrowd & { ts: number }) | null = null;","let listeners: Array<(p: PendingCrowd) => void> = [];","","const isFresh = (ts: number) => Date.now() - (ts || 0) <= MAX_AGE_MS;","","export const setPendingCrowd = async (crowdId: string, crowdName: string) => {","  const entry = { crowdId: String(crowdId), crowdName: crowdName || '', ts: Date.now() };","  memoryPending = entry;","  console.log('Pending crowd stored for after boot:', crowdId);","  // Tell anything already listening straight away.","  const current = listeners.slice();","  if (current.length) {","    memoryPending = null;","    try {","      await AsyncStorage.removeItem(KEY);","    } catch (_) {}","    current.forEach(fn => {","      try {","        fn({ crowdId: entry.crowdId, crowdName: entry.crowdName });","      } catch (_) {}","    });","    return;","  }","  try {","    await AsyncStorage.setItem(KEY, JSON.stringify(entry));","  } catch (_) {}","};","","// Read-and-clear. Returns null if nothing pending or it has gone stale.","export const consumePendingCrowd = async (): Promise<PendingCrowd | null> => {","  if (memoryPending) {","    const m = memoryPending;","    memoryPending = null;","    try {","      await AsyncStorage.removeItem(KEY);","    } catch (_) {}","    if (isFresh(m.ts)) return { crowdId: m.crowdId, crowdName: m.crowdName };","    return null;","  }","  try {","    const raw = await AsyncStorage.getItem(KEY);","    if (!raw) return null;","    await AsyncStorage.removeItem(KEY);","    const parsed = JSON.parse(raw);","    if (!parsed?.crowdId) return null;","    if (!isFresh(parsed.ts)) return null;","    return { crowdId: String(parsed.crowdId), crowdName: parsed.crowdName || '' };","  } catch (_) {","    return null;","  }","};","","// Listen for a tap that lands after this screen is already mounted.","// Returns an unsubscribe function.","export const subscribePendingCrowd = (fn: (p: PendingCrowd) => void) => {","  listeners.push(fn);","  return () => {","    listeners = listeners.filter(l => l !== fn);","  };","};"].join("\n"));console.log("PATCH: created utils/pendingCrowd.ts");const NAV5="src/navigation/index.tsx";let n5=readMust(NAV5);n5=replaceOnce(n5,"import { navigationRef as rootNavigationRef, navigateTo, resetToScreen } from '../utils/navigationRef';",["import { navigationRef as rootNavigationRef, navigateTo, resetToScreen } from '../utils/navigationRef';","import { extractCrowdId, extractCrowdName, setPendingCrowd } from '../utils/pendingCrowd';"].join("\n"),"pendingCrowd import");n5=replaceOnce(n5,["      console.log('Notification tapped, payload:', JSON.stringify(data || {}));","      try {","        // Ghost crowd push: accept any key spelling the backend may use.","        const crowdId =","          data?.crowdId || data?.crowd_id || data?.crowdID ||","          (data?.type === 'crowd' || data?.chatType === 'crowd' ? data?.chatId || data?.id : null);","        if (crowdId) {","          const crowdName = data?.crowdName || data?.crowd_name || data?.title || '';"].join("\n"),["      console.log('Notification tapped, payload:', JSON.stringify(data || {}));","      try {","        // Search the whole payload - iOS cold-start pushes can nest this.","        const crowdId = extractCrowdId(data);","        if (crowdId) {","          const crowdName = extractCrowdName(data);","          // Record it FIRST. If the app is still booting, the Ghost home","          // screen will pick this up on focus and open the crowd, so the","          // tap can no longer be lost to navigator timing.","          setPendingCrowd(String(crowdId), crowdName);"].join("\n"),"tap -> persist pending crowd");fs.writeFileSync(NAV5,n5);console.log("PATCH: notification tap now persisted before navigating");const HOME="src/screens/Ghost/GhostModeHomeScreen.js";let h=readMust(HOME);h=replaceOnce(h,"import { getCrowdDisplayName } from '../../utils/helper';",["import { getCrowdDisplayName } from '../../utils/helper';","import { consumePendingCrowd, subscribePendingCrowd } from '../../utils/pendingCrowd';"].join("\n"),"home pendingCrowd import");h=replaceOnce(h,["  // Handle Android back button - block back on home screen, use exit button instead","  useFocusEffect(","    React.useCallback(() => {","      StatusBar.setHidden(true, 'none');"].join("\n"),["  // If a notification tap happened while the app was closed, the crowd was","  // stored before the navigator existed. We are now mounted and focused -","  // which is exactly where a cold start wrongly stopped - so open it here.","  useFocusEffect(","    React.useCallback(() => {","      let cancelled = false;","","      const open = pending => {","        if (!pending || cancelled) return;","        console.log('Opening crowd from notification tap:', pending.crowdId);","        navigation.navigate('CrowdChatScreen', {","          crowdId: pending.crowdId,","          crowdName: pending.crowdName,","          ghostName: displayName,","          avatarBgColor: avatarColor,","          isCreator: false,","        });","      };","","      // Case A: the tap was stored before this screen existed (cold start).","      (async () => {","        try {","          open(await consumePendingCrowd());","        } catch (_) {}","      })();","","      // Case B: the tap lands while we are already sitting here.","      const unsubscribe = subscribePendingCrowd(open);","","      return () => {","        cancelled = true;","        unsubscribe();","      };","    }, [displayName, avatarColor, navigation]),","  );","","  // Handle Android back button - block back on home screen, use exit button instead","  useFocusEffect(","    React.useCallback(() => {","      StatusBar.setHidden(true, 'none');"].join("\n"),"home consumes pending crowd on focus");fs.writeFileSync(HOME,h);console.log("PATCH: Ghost home screen opens the crowd from a stored tap")}{const NAV6="src/navigation/index.tsx";let n6=readMust(NAV6);n6=replaceOnce(n6,"import { extractCrowdId, extractCrowdName, setPendingCrowd } from '../utils/pendingCrowd';","import { extractCrowdId, extractCrowdName, setPendingCrowd, consumePendingCrowd } from '../utils/pendingCrowd';","nav consumePendingCrowd import");n6=replaceOnce(n6,["  if (","    current && current.name === 'CrowdChatScreen' &&","    String(current.params?.crowdId ?? '') === String(crowdId)","  ) {","    console.log('Notification tap: crowd screen is open');","    return;","  }","  // A non-null current route proves real screens are mounted.","  if (ready && current) {","    navigateTo('CrowdChatScreen', params);","  }","  if (attempt < 60) {"].join("\n"),["  if (","    current && current.name === 'CrowdChatScreen' &&","    String(current.params?.crowdId ?? '') === String(crowdId)","  ) {","    console.log('Notification tap: crowd screen is open');","    // Landed. Drop the stored tap so no screen replays it later.","    consumePendingCrowd();","    return;","  }","  // A non-null current route proves real screens are mounted.","  if (ready && current) {","    navigateTo('CrowdChatScreen', params);","  }","  // ~6s of retries, not 18s: after that the home screen focus effect","  // is the safety net, and a long loop would drag the user back if","  // they deliberately navigated away.","  if (attempt < 20) {"].join("\n"),"notification retry stops once landed");fs.writeFileSync(NAV6,n6);console.log("PATCH: notification retry loop stops once it lands (no replay)")}{const DIAG="src/utils/bootDiag.ts";fs.writeFileSync(DIAG,["// Timestamped trace of the notification path, held in memory and shown","// on screen by DiagPanel. Deliberately dependency-free so it cannot","// itself fail during boot.","export type DiagEvent = { t: number; tag: string; detail: string };","","const MAX_EVENTS = 80;","const START = Date.now();","","let events: DiagEvent[] = [];","let listeners: Array<() => void> = [];","","const safeStringify = (v: any): string => {","  if (v === undefined) return '';","  if (typeof v === 'string') return v;","  try {","    return JSON.stringify(v);","  } catch (_) {","    try {","      return String(v);","    } catch (__) {","      return '<unprintable>';","    }","  }","};","","export const diag = (tag: string, detail?: any) => {","  try {","    events.push({ t: Date.now() - START, tag, detail: safeStringify(detail) });","    if (events.length > MAX_EVENTS) events.shift();","    console.log('[DIAG] ' + tag + ' ' + safeStringify(detail));","    listeners.slice().forEach(fn => {","      try {","        fn();","      } catch (_) {}","    });","  } catch (_) {}","};","","export const getDiag = (): DiagEvent[] => events.slice();","","export const clearDiag = () => {","  events = [];","  listeners.slice().forEach(fn => {","    try {","      fn();","    } catch (_) {}","  });","};","","export const subscribeDiag = (fn: () => void) => {","  listeners.push(fn);","  return () => {","    listeners = listeners.filter(l => l !== fn);","  };","};","","export const diagAsText = (): string =>","  events.map(e => '+' + e.t + 'ms  ' + e.tag + (e.detail ? '\\n     ' + e.detail : '')).join('\\n');"].join("\n"));console.log("PATCH: created utils/bootDiag.ts")}{const NOTE="src/utils/notification.ts";let n=readMust(NOTE);n=replaceOnce(n,"import messaging from '@react-native-firebase/messaging';","import messaging from '@react-native-firebase/messaging';\nimport { diag } from './bootDiag';","notification diag import");n=replaceOnce(n,["const handleTapOnce = (data: any, onNotificationTap?: (data: any) => void) => {","  if (!onNotificationTap || !data) return;"].join("\n"),["const handleTapOnce = (data: any, onNotificationTap?: (data: any) => void, via?: string) => {","  diag('tap.received', { via: via || 'unknown', hasCallback: !!onNotificationTap, data });","  if (!onNotificationTap || !data) {","    diag('tap.DROPPED', !onNotificationTap ? 'no callback registered' : 'payload was empty');","    return;","  }"].join("\n"),"handleTapOnce diag");n=replaceOnce(n,"  if (key === lastTapKey && now - lastTapAt < 3000) return;",["  if (key === lastTapKey && now - lastTapAt < 3000) {","    diag('tap.deduped', via || '');","    return;","  }"].join("\n"),"handleTapOnce dedupe diag");n=replaceOnce(n,["      console.log('Notification tapped (expo):', data);","      handleTapOnce(data, onNotificationTap);"].join("\n"),["      console.log('Notification tapped (expo):', data);","      handleTapOnce(data, onNotificationTap, 'expo.responseReceived');"].join("\n"),"expo response diag");n=replaceOnce(n,["    console.log('FCM notification opened app:', remoteMessage);","    handleTapOnce(remoteMessage?.data, onNotificationTap);"].join("\n"),["    console.log('FCM notification opened app:', remoteMessage);","    diag('fcm.onNotificationOpenedApp', remoteMessage);","    handleTapOnce(remoteMessage?.data, onNotificationTap, 'fcm.onNotificationOpenedApp');"].join("\n"),"fcm opened diag");n=replaceOnce(n,["    console.log('FCM foreground message:', remoteMessage);"].join("\n"),["    console.log('FCM foreground message:', remoteMessage);","    // Foreground pushes reveal the exact payload shape the server sends,","    // without needing a cold start at all.","    diag('fcm.onMessage RAW', remoteMessage);"].join("\n"),"fcm foreground diag");n=replaceOnce(n,["  // Cold start: the app was launched by tapping a remote notification.","  try {","    const initialFCM = await messaging().getInitialNotification();","    if (initialFCM) {","      console.log('FCM initial notification:', initialFCM);","      handleTapOnce(initialFCM?.data, onNotificationTap);","    }","  } catch (e) {","    console.log('getInitialNotification failed:', e);","  }","","  // Check if app was opened from a notification (terminated state)","  const lastNotification = await Notifications.getLastNotificationResponseAsync();","  if (lastNotification) {","    const data = lastNotification.notification.request.content.data;","    console.log('App opened from notification (terminated):', data);","    handleTapOnce(data, onNotificationTap);","  }"].join("\n"),["  // Cold start. Both libraries can answer this, and either may return","  // nothing if it is not yet initialised at the moment we ask - so ask","  // repeatedly for the first few seconds instead of exactly once, and","  // record every answer so a null result is visible rather than silent.","  let coldStartFound = false;","","  const askColdStart = async (attempt: number) => {","    if (coldStartFound) return;","","    try {","      const initialFCM = await messaging().getInitialNotification();","      if (initialFCM) {","        diag('fcm.getInitialNotification HIT (attempt ' + attempt + ')', initialFCM);","        coldStartFound = true;","        handleTapOnce(initialFCM?.data, onNotificationTap, 'fcm.getInitialNotification');","        return;","      }","      if (attempt === 0) diag('fcm.getInitialNotification', 'NULL');","    } catch (e) {","      diag('fcm.getInitialNotification ERROR', String(e));","    }","","    try {","      const lastNotification = await Notifications.getLastNotificationResponseAsync();","      if (lastNotification) {","        const data = lastNotification.notification.request.content.data;","        diag('expo.getLastNotificationResponse HIT (attempt ' + attempt + ')', lastNotification?.notification?.request?.content);","        coldStartFound = true;","        handleTapOnce(data, onNotificationTap, 'expo.getLastNotificationResponse');","        return;","      }","      if (attempt === 0) diag('expo.getLastNotificationResponse', 'NULL');","    } catch (e) {","      diag('expo.getLastNotificationResponse ERROR', String(e));","    }","","    if (attempt < 12) {","      setTimeout(() => askColdStart(attempt + 1), 700);","    } else {","      diag('coldstart.NOTHING_FOUND', 'neither library reported a launch notification after ~9s');","    }","  };","","  diag('coldstart.polling started');","  askColdStart(0);"].join("\n"),"cold start retry + diag");n=replaceOnce(n,"export const NotificationListener = async (\n  onNotificationTap?: (data: any) => void,\n) => {",["export const NotificationListener = async (","  onNotificationTap?: (data: any) => void,",") => {","  diag('listener.registered', 'platform=' + Platform.OS);"].join("\n"),"listener registered diag");fs.writeFileSync(NOTE,n);console.log("PATCH: notification pipeline instrumented (raw payloads recorded)")}{const NAV7="src/navigation/index.tsx";let n7=readMust(NAV7);n7=replaceOnce(n7,"import { extractCrowdId, extractCrowdName, setPendingCrowd, consumePendingCrowd } from '../utils/pendingCrowd';","import { extractCrowdId, extractCrowdName, setPendingCrowd, consumePendingCrowd } from '../utils/pendingCrowd';\nimport { diag } from '../utils/bootDiag';","nav diag import");n7=replaceOnce(n7,["        // Search the whole payload - iOS cold-start pushes can nest this.","        const crowdId = extractCrowdId(data);","        if (crowdId) {"].join("\n"),["        // Search the whole payload - iOS cold-start pushes can nest this.","        const crowdId = extractCrowdId(data);","        diag('extract.crowdId', crowdId ? String(crowdId) : 'FAILED - no crowd id in this payload');","        if (crowdId) {"].join("\n"),"extract diag");fs.writeFileSync(NAV7,n7);const PEND2="src/utils/pendingCrowd.ts";let p2=readMust(PEND2);p2=replaceOnce(p2,"import AsyncStorage from '@react-native-async-storage/async-storage';","import AsyncStorage from '@react-native-async-storage/async-storage';\nimport { diag } from './bootDiag';","pendingCrowd diag import");p2=replaceOnce(p2,"  console.log('Pending crowd stored for after boot:', crowdId);","  diag('pending.stored', entry.crowdId);","pending stored diag");p2=replaceOnce(p2,["  const current = listeners.slice();","  if (current.length) {"].join("\n"),["  const current = listeners.slice();","  diag('pending.liveListeners', current.length);","  if (current.length) {"].join("\n"),"pending listeners diag");fs.writeFileSync(PEND2,p2);const HOME3="src/screens/Ghost/GhostModeHomeScreen.js";let h3=readMust(HOME3);h3=replaceOnce(h3,"import { consumePendingCrowd, subscribePendingCrowd } from '../../utils/pendingCrowd';","import { consumePendingCrowd, subscribePendingCrowd } from '../../utils/pendingCrowd';\nimport { diag } from '../../utils/bootDiag';\nimport DiagPanel from '../../component/Ghost/DiagPanel';","home diag import");h3=replaceOnce(h3,["      const open = pending => {","        if (!pending || cancelled) return;"].join("\n"),["      diag('home.focused', 'crowd list is on screen and listening');","","      const open = pending => {","        if (!pending || cancelled) return;","        diag('home.navigating', pending.crowdId);"].join("\n"),"home focus diag");h3=replaceOnce(h3,["      (async () => {","        try {","          open(await consumePendingCrowd());","        } catch (_) {}","      })();"].join("\n"),["      (async () => {","        try {","          const stored = await consumePendingCrowd();","          diag('home.consumePending', stored ? stored.crowdId : 'nothing stored');","          open(stored);","        } catch (_) {}","      })();"].join("\n"),"home consume diag");h3=replaceOnce(h3,"    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>\n      <View style={styles.container}>","    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>\n      <View style={styles.container}>\n        <DiagPanel />","home DiagPanel mount");fs.writeFileSync(HOME3,h3);console.log("PATCH: extraction + storage + home screen instrumented")}{const PANEL_DIR="src/component/Ghost";if(!fs.existsSync(PANEL_DIR)){throw new Error("PATCH: expected component dir missing: "+PANEL_DIR)}const PANEL=PANEL_DIR+"/DiagPanel.js";fs.writeFileSync(PANEL,["import React, { useEffect, useState } from 'react';","import {","  View,","  Text,","  Modal,","  ScrollView,","  TouchableOpacity,","  StyleSheet,","} from 'react-native';","import { getDiag, clearDiag, subscribeDiag } from '../../utils/bootDiag';","","const DiagPanel = () => {","  const [open, setOpen] = useState(false);","  const [events, setEvents] = useState(getDiag());","","  useEffect(() => {","    const unsubscribe = subscribeDiag(() => setEvents(getDiag()));","    setEvents(getDiag());","    return unsubscribe;","  }, []);","","  const failed = events.some(","    e =>","      e.tag.indexOf('NOTHING_FOUND') !== -1 ||","      e.tag.indexOf('DROPPED') !== -1 ||","      (e.tag === 'extract.crowdId' && e.detail.indexOf('FAILED') === 0),","  );","","  return (",'    <View pointerEvents="box-none" style={styles.host}>',"      <TouchableOpacity","        style={[styles.pill, failed ? styles.pillBad : null]}","        onPress={() => setOpen(true)}","        activeOpacity={0.85}>",'        <Text style={styles.pillText}>{"DIAG " + events.length}</Text>',"      </TouchableOpacity>","","      <Modal","        visible={open}",'        animationType="slide"',"        transparent={false}","        onRequestClose={() => setOpen(false)}>","        <View style={styles.sheet}>","          <View style={styles.sheetHeader}>","            <Text style={styles.sheetTitle}>Notification trace</Text>","            <TouchableOpacity onPress={() => setOpen(false)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>","              <Text style={styles.sheetClose}>Close</Text>","            </TouchableOpacity>","          </View>","","          <Text style={styles.hint}>","            Screenshot this whole screen and send it to the developer.","          </Text>","","          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollInner}>","            {events.length === 0 ? (","              <Text style={styles.empty}>No events recorded yet.</Text>","            ) : (","              events.map((e, i) => (","                <View key={i} style={styles.row}>","                  <Text selectable style={styles.rowTag}>","                    {'+' + e.t + 'ms  ' + e.tag}","                  </Text>","                  {e.detail ? (","                    <Text selectable style={styles.rowDetail}>","                      {e.detail}","                    </Text>","                  ) : null}","                </View>","              ))","            )}","          </ScrollView>","","          <TouchableOpacity","            style={styles.clearBtn}","            onPress={() => {","              clearDiag();","              setEvents([]);","            }}","            activeOpacity={0.85}>","            <Text style={styles.clearText}>Clear before next test</Text>","          </TouchableOpacity>","        </View>","      </Modal>","    </View>","  );","};","","const styles = StyleSheet.create({","  host: {","    position: 'absolute',","    right: 10,","    bottom: 24,","    zIndex: 9999,","  },","  pill: {","    paddingHorizontal: 12,","    paddingVertical: 7,","    borderRadius: 999,","    backgroundColor: 'rgba(155,123,255,0.9)',","  },","  pillBad: {","    backgroundColor: 'rgba(226,76,76,0.95)',","  },","  pillText: {","    color: '#FFFFFF',","    fontSize: 12,","    fontWeight: '700',","  },","  sheet: {","    flex: 1,","    backgroundColor: '#0A0A14',","    paddingTop: 60,","    paddingHorizontal: 16,","    paddingBottom: 20,","  },","  sheetHeader: {","    flexDirection: 'row',","    alignItems: 'center',","    justifyContent: 'space-between',","    marginBottom: 6,","  },","  sheetTitle: {","    color: '#FFFFFF',","    fontSize: 18,","    fontWeight: '700',","  },","  sheetClose: {","    color: '#9B7BFF',","    fontSize: 15,","    fontWeight: '600',","  },","  hint: {","    color: '#8B8CAD',","    fontSize: 12,","    marginBottom: 12,","  },","  scroll: {","    flex: 1,","  },","  scrollInner: {","    paddingBottom: 20,","  },","  row: {","    marginBottom: 10,","    borderLeftWidth: 2,","    borderLeftColor: 'rgba(155,123,255,0.5)',","    paddingLeft: 8,","  },","  rowTag: {","    color: '#FFFFFF',","    fontSize: 12,","    fontWeight: '700',","  },","  rowDetail: {","    color: '#9FE8C0',","    fontSize: 11,","    marginTop: 2,","  },","  empty: {","    color: '#8B8CAD',","    fontSize: 13,","  },","  clearBtn: {","    marginTop: 10,","    paddingVertical: 12,","    borderRadius: 12,","    backgroundColor: 'rgba(155,123,255,0.15)',","    alignItems: 'center',","  },","  clearText: {","    color: '#9B7BFF',","    fontSize: 14,","    fontWeight: '600',","  },","});","","export default DiagPanel;"].join("\n"));console.log("PATCH: on-screen diagnostic panel added to Ghost home screen")}{const CC="src/screens/Ghost/CrowdChatScreen.js";let cc=readMust(CC);cc=replaceOnce(cc,"  const { crowdId, crowdName, ghostName, avatarBgColor, isCreator, duration, qrCodeData } = route.params || {};",["  const { crowdId, crowdName, ghostName, avatarBgColor, isCreator, duration, qrCodeData } = route.params || {};","  React.useEffect(() => {","    diag('crowdscreen.mounted', { crowdId, crowdName, ghostName, hasParams: !!route.params });","  }, []);"].join("\n"),"crowd screen mount diag");cc=replaceOnce(cc,["      if (!crowdId) {","        setToastMsg('Crowd ID is missing');","        navigation.goBack();","        return;","      }"].join("\n"),["      if (!crowdId) {","        diag('crowdscreen.BOUNCED', 'crowdId was empty - going straight back to the crowd list');","        setToastMsg('Crowd ID is missing');","        navigation.goBack();","        return;","      }"].join("\n"),"crowd screen bounce diag");cc=replaceOnce(cc,"import { getGhostDeviceId } from '../../utils/ghostDeviceId';","import { getGhostDeviceId } from '../../utils/ghostDeviceId';\nimport { diag } from '../../utils/bootDiag';","crowd screen diag import");fs.writeFileSync(CC,cc);console.log("PATCH: crowd screen records its params and any bounce-back")}{const NOTE2="src/utils/notification.ts";let n2=readMust(NOTE2);n2=replaceOnce(n2,"import { diag } from './bootDiag';","import { diag } from './bootDiag';\nimport { extractCrowdId, extractCrowdName, setPendingCrowd } from './pendingCrowd';","notification pendingCrowd import");n2=replaceOnce(n2,["  lastTapKey = key;","  lastTapAt = now;","  onNotificationTap(data);","};"].join("\n"),["  lastTapKey = key;","  lastTapAt = now;","","  // Store the crowd HERE, before handing off. This module is proven to","  // run on cold start, so the tap can no longer be lost to whatever is","  // swallowing the app-level callback.","  try {","    const cid = extractCrowdId(data);","    diag('tap.inlineExtract', cid ? String(cid) : 'FAILED - no crowd id in payload');","    if (cid) {","      setPendingCrowd(String(cid), extractCrowdName(data));","    }","  } catch (e) {","    diag('tap.inlineExtract ERROR', String(e));","  }","","  try {","    onNotificationTap(data);","  } catch (e) {","    diag('appCallback.THREW', String(e));","  }","};"].join("\n"),"inline extract + store before callback");fs.writeFileSync(NOTE2,n2);console.log("PATCH: crowd is now stored inside notification.ts, ahead of the app callback")}{const PEND3="src/utils/pendingCrowd.ts";let p3=readMust(PEND3);p3=replaceOnce(p3,["    const type = (node as any).type || (node as any).chatType;","    if (type === 'crowd') {","      const v = (node as any).chatId ?? (node as any).id;","      if (v !== undefined && v !== null && String(v) !== '') return String(v);","    }"].join("\n"),["    const type = (node as any).type || (node as any).chatType;","    if (type === 'crowd') {","      const v =","        (node as any).chatId ??","        (node as any).conversationId ??","        (node as any).id;","      if (v !== undefined && v !== null && String(v) !== '') return String(v);","    }","","    // Some pushes omit chatType entirely and only carry the ids.","    const convo = (node as any).conversationId ?? (node as any).chatId;","    if (!type && convo !== undefined && convo !== null && String(convo) !== '') {","      return String(convo);","    }"].join("\n"),"widen crowd id extraction");fs.writeFileSync(PEND3,p3);console.log("PATCH: crowd id extraction widened (chatId / conversationId)")}{const NAV8="src/navigation/index.tsx";let n8=readMust(NAV8);n8=replaceOnce(n8,["    NotificationListener((data: any) => {","      console.log('Notification tapped, payload:', JSON.stringify(data || {}));","      try {"].join("\n"),["    NotificationListener((data: any) => {","      diag('appCallback.entered', 'first line of the app tap handler');","      try {","        console.log('Notification tapped, payload:', JSON.stringify(data || {}));"].join("\n"),"app callback entry probe");fs.writeFileSync(NAV8,n8);const PANEL2="src/component/Ghost/DiagPanel.js";let pn=readMust(PANEL2);pn=replaceOnce(pn,["  const failed = events.some(","    e =>","      e.tag.indexOf('NOTHING_FOUND') !== -1 ||","      e.tag.indexOf('DROPPED') !== -1 ||","      (e.tag === 'extract.crowdId' && e.detail.indexOf('FAILED') === 0),","  );"].join("\n"),["  // Only flag a real failure. A launch with no notification correctly","  // reports NOTHING_FOUND, and the second delivery channel correctly","  // reports an empty payload - neither is a fault.","  const sawTap = events.some(e => e.tag.indexOf('HIT') !== -1);","  const failed = events.some(","    e =>","      (e.detail || '').indexOf('FAILED') === 0 ||","      e.tag.indexOf('ERROR') !== -1 ||","      e.tag.indexOf('THREW') !== -1 ||","      e.tag.indexOf('BOUNCED') !== -1 ||","      (sawTap && e.tag === 'home.consumePending' && e.detail.indexOf('nothing') === 0),","  );"].join("\n"),"diag panel failure detection");fs.writeFileSync(PANEL2,pn);console.log("PATCH: callback entry probe added; diag pill only reddens on real faults")}{const HOME4="src/screens/Ghost/GhostModeHomeScreen.js";let h4=readMust(HOME4);h4=replaceOnce(h4,["      const open = pending => {","        if (!pending || cancelled) return;","        diag('home.navigating', pending.crowdId);","        console.log('Opening crowd from notification tap:', pending.crowdId);","        navigation.navigate('CrowdChatScreen', {","          crowdId: pending.crowdId,","          crowdName: pending.crowdName,","          ghostName: displayName,","          avatarBgColor: avatarColor,","          isCreator: false,","        });","      };"].join("\n"),["      const open = async pending => {","        if (!pending || cancelled) return;","","        // Read the ghost identity from storage rather than from screen","        // state: on a cold start this runs before the state has loaded,",'        // and passing the placeholder makes the user post as "Ghost".',"        let gName = ghostName;","        let gColor = avatarBgColor;","        try {","          const stored = await getGhostLogin();","          if (stored && stored.ghostName) {","            gName = stored.ghostName;","            gColor = stored.avatarBgColor || gColor;","          }","        } catch (_) {}","        if (cancelled) return;","","        diag('home.navigating', {","          crowdId: pending.crowdId,","          ghostName: gName || 'MISSING - falling back to Ghost',","        });","        navigation.navigate('CrowdChatScreen', {","          crowdId: pending.crowdId,","          crowdName: pending.crowdName,","          ghostName: gName || 'Ghost',","          avatarBgColor: gColor || '#155DFC',","          isCreator: false,","        });","      };"].join("\n"),"home uses stored ghost identity");h4=replaceOnce(h4,"    }, [displayName, avatarColor, navigation]),\n  );","    }, [ghostName, avatarBgColor, navigation]),\n  );","home pending effect deps");fs.writeFileSync(HOME4,h4);console.log("PATCH: notification-opened crowd now uses the real ghost name")}{const HOME5="src/screens/Ghost/GhostModeHomeScreen.js";let h5=readMust(HOME5);h5=replaceOnce(h5,"      <View style={styles.container}>\n        <DiagPanel />","      <View style={styles.container}>\n        {SHOW_DIAG_PANEL ? <DiagPanel /> : null}","diag panel gated");h5=replaceOnce(h5,"import DiagPanel from '../../component/Ghost/DiagPanel';",["import DiagPanel from '../../component/Ghost/DiagPanel';","","// Set to true to show the on-screen notification trace during debugging.","const SHOW_DIAG_PANEL = false;"].join("\n"),"diag panel flag");fs.writeFileSync(HOME5,h5);console.log("PATCH: debug pill hidden (SHOW_DIAG_PANEL = false)")}

{
  // ---- ITEM 3: server errors must not be laundered into connection errors ----
  // The global axios interceptor replaced EVERY 403 and 5xx with a bare Error,
  // which destroys error.response. Downstream screens check error.response to
  // decide what to show, so their per-status handling was unreachable and every
  // server error surfaced as "check your connection". Preserve the original
  // error (flagged) so callers can tell an HTTP error from a real network fault.
  const INTC = "src/utils/apiInterceptor.ts";
  let intc = readMust(INTC);
  const OLD403 = [
    "      if (error.response?.status === 403) {",
    "        return Promise.reject(",
    "          new Error('Access denied. Please login again.'),",
    "        );",
    "      }",
    "",
    "      if (error.response?.status >= 500) {",
    "        return Promise.reject(",
    "          new Error('Server error. Please try again later.'),",
    "        );",
    "      }",
  ].join("\n");
  const NEW403 = [
    "      // Preserve the server response on HTTP errors. Callers need",
    "      // error.response.data to show the real message; replacing it with a",
    "      // bare Error made every server error look like a network failure.",
    "      if (error.response?.status === 403) {",
    "        (error as any).isAuthError = true;",
    "        return Promise.reject(error);",
    "      }",
    "",
    "      if (error.response?.status >= 500) {",
    "        (error as any).isServerError = true;",
    "        return Promise.reject(error);",
    "      }",
  ].join("\n");
  intc = replaceOnce(intc, OLD403, NEW403, "interceptor: preserve 403/5xx response");

  // Flag genuine transport failures so screens can distinguish them explicitly.
  const OLDNET = [
    "      if (!error.response) {",
    "        return Promise.reject(",
    "          new Error('Network error. Please check your internet connection.'),",
    "        );",
    "      }",
  ].join("\n");
  const NEWNET = [
    "      if (!error.response) {",
    "        const netErr: any = new Error(",
    "          'Network error. Please check your internet connection.',",
    "        );",
    "        netErr.isNetworkError = true;",
    "        return Promise.reject(netErr);",
    "      }",
  ].join("\n");
  intc = replaceOnce(intc, OLDNET, NEWNET, "interceptor: flag network errors");

  const OLDTO = [
    "      if (error.code === 'ECONNABORTED') {",
    "        return Promise.reject(",
    "          new Error('Request timed out. Please check your connection and try again.'),",
    "        );",
    "      }",
  ].join("\n");
  const NEWTO = [
    "      if (error.code === 'ECONNABORTED') {",
    "        const toErr: any = new Error(",
    "          'Request timed out. Please check your connection and try again.',",
    "        );",
    "        toErr.isNetworkError = true;",
    "        return Promise.reject(toErr);",
    "      }",
  ].join("\n");
  intc = replaceOnce(intc, OLDTO, NEWTO, "interceptor: flag timeouts");
  fs.writeFileSync(INTC, intc);
  console.log("PATCH: interceptor now preserves server errors (403/5xx) and flags network faults");
}

{
  // ---- ITEM 3b: invite screen shows the real reason ----
  const INV = "src/screen/account-creation/auth/enter-verify-code/index.tsx";
  let inv = readMust(INV);
  const OLDCATCH = [
    "    } catch (error: any) {",
    "      console.error('Error verifying invite code:', error);",
    "      setErrorMessage('Unable to verify the code right now. Please check your connection and try again.');",
    "      setShowError(true);",
  ].join("\n");
  const NEWCATCH = [
    "    } catch (error: any) {",
    "      console.error('Error verifying invite code:', error);",
    "      // Separate a real transport failure from an HTTP error carrying a",
    "      // server message. Only the former is a connection problem.",
    "      const serverData = error?.response?.data;",
    "      if (serverData) {",
    "        const status = serverData?.status || error?.response?.status;",
    "        const msg: string = serverData?.message || '';",
    "        let userMessage = 'Invalid invite code. Please check and try again.';",
    "        if (status === 400) {",
    "          userMessage = 'Please enter a valid invite code.';",
    "        } else if (status === 404) {",
    "          userMessage = 'This invite code does not exist. Please check and try again.';",
    "        } else if (status === 403) {",
    "          if (msg.includes('maximum') || msg.includes('reached')) {",
    "            userMessage = 'This invite code has already been used by 3 people and is no longer valid.';",
    "          } else {",
    "            userMessage = 'This invite code cannot be used to register. Please ask for a different code.';",
    "          }",
    "        } else if (status >= 500) {",
    "          userMessage = 'Something went wrong on our end. Please try again.';",
    "        }",
    "        setErrorMessage(userMessage);",
    "      } else if (error?.isNetworkError || !error?.response) {",
    "        setErrorMessage('Unable to reach the server. Please check your connection and try again.');",
    "      } else {",
    "        setErrorMessage('Unable to verify the code right now. Please try again.');",
    "      }",
    "      setShowError(true);",
  ].join("\n");
  inv = replaceOnce(inv, OLDCATCH, NEWCATCH, "invite screen: real error messages");
  fs.writeFileSync(INV, inv);
  console.log("PATCH: invite screen distinguishes server errors from network failures");
}

// --- v22: always send the country code with the OTP request ---------------
// MSG91 rejects a bare national number with error 202 (invalid mobile number),
// which is the API failure their team reported. The payload was
// `fullNumber || data?.phone`, and fullNumber is only ever populated by the
// phone input's onChangeFormattedText callback - whenever that has not fired,
// the fallback sends the NATIONAL number with no country code. Send the
// calling code explicitly so the server can always build a dialable number.
{
  const REGC = "src/component/register-component/index.tsx";
  let regc = readMust(REGC);
  const OLDPAY = [
    "                // Remove + from phone number",
    "                const phoneWithoutPlus = (fullNumber || data?.phone || '').replace(/^\\+/, '')",
    "",
    "                // Prepare payload for MSG91 send-otp API",
    "                const msg91Payload = {",
    "                    phone: phoneWithoutPlus,",
    "                    flowType: 'register'",
    "                }",
  ].join("\n");
  const NEWPAY = [
    "                // Remove + from phone number",
    "                const phoneWithoutPlus = (fullNumber || data?.phone || '').replace(/^\\+/, '')",
    "",
    "                // `fullNumber` is only populated by onChangeFormattedText. If that",
    "                // never fired we fall back to data.phone, which is the NATIONAL",
    "                // number with no country code - MSG91 rejects that with error 202",
    "                // (invalid mobile number). Send the calling code explicitly so the",
    "                // server can always build a dialable number.",
    "                let callingCode = ''",
    "                try {",
    "                    callingCode = phoneInputRef.current?.getCallingCode?.() || ''",
    "                } catch (_) { }",
    "",
    "                // Prepare payload for MSG91 send-otp API",
    "                const msg91Payload = {",
    "                    phone: phoneWithoutPlus,",
    "                    countryCode: callingCode,",
    "                    flowType: 'register'",
    "                }",
  ].join("\n");
  regc = replaceOnce(regc, OLDPAY, NEWPAY, "register: send countryCode with OTP request");
  fs.writeFileSync(REGC, regc);
  console.log("PATCH: register screen sends countryCode with the OTP request");
}

// --- v23: wallet files open in a viewer, not the share sheet --------------
// Reported from testing: a file added to the wallet shows in the list, but
// opening it decrypts and then drops the user on the system "share with..."
// sheet instead of showing the document. handleViewFullScreen called
// Sharing.shareAsync() for every type. Images now open in the app's own
// full-screen viewer, documents open through an Android VIEW intent (the real
// PDF/document viewer), and sharing stays only as the iOS Quick Look path and
// the fallback when nothing can handle the type.
{
  const WAL = "src/screen/wallet-screen/index.tsx";
  let wal = readMust(WAL);

  wal = replaceOnce(wal,
    ["  Alert,", "  Linking,", "  Platform,", "} from 'react-native';"].join("\n"),
    ["  Alert,", "  Image,", "  Linking,", "  Platform,", "} from 'react-native';"].join("\n"),
    "wallet: import Image");

  wal = replaceOnce(wal,
    "import * as Sharing from 'expo-sharing';",
    ["import * as Sharing from 'expo-sharing';",
     "import * as FileSystem from 'expo-file-system';",
     "import * as IntentLauncher from 'expo-intent-launcher';"].join("\n"),
    "wallet: import FileSystem + IntentLauncher");

  wal = replaceOnce(wal,
    ["  // Multi-device wallet passphrase",
     "  const [showPassphrase, setShowPassphrase] = useState(false);"].join("\n"),
    ["  // Full-screen viewer for a decrypted image",
     "  const [viewerUri, setViewerUri] = useState<string | null>(null);",
     "  const [viewerName, setViewerName] = useState('');",
     "",
     "  // Multi-device wallet passphrase",
     "  const [showPassphrase, setShowPassphrase] = useState(false);"].join("\n"),
    "wallet: viewer state");

  wal = replaceOnce(wal,
    ["      const canShare = await Sharing.isAvailableAsync();",
     "      if (canShare) {",
     "        await Sharing.shareAsync(localUri, {",
     "          mimeType: selectedItem.mimeType,",
     "          dialogTitle: selectedItem.name,",
     "        });",
     "      } else {",
     "        await Linking.openURL(localUri);",
     "      }"].join("\n"),
    ["      const mime = selectedItem.mimeType || '';",
     "      const isImage = selectedItem.type === 'image' || mime.startsWith('image/');",
     "",
     "      // Images open in the app's own viewer. Handing them to the share",
     "      // sheet was the reported problem: the file decrypted correctly but",
     "      // the user was offered \"share with...\" instead of the document.",
     "      if (isImage) {",
     "        setViewerName(selectedItem.name);",
     "        setViewerUri(localUri);",
     "        setToastMsg?.('');",
     "        return;",
     "      }",
     "",
     "      // Everything else goes to a real viewer app. On Android that is an",
     "      // explicit VIEW intent, which opens the PDF or document viewer",
     "      // directly rather than the share sheet.",
     "      if (Platform.OS === 'android') {",
     "        try {",
     "          const contentUri = await FileSystem.getContentUriAsync(localUri);",
     "          await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {",
     "            data: contentUri,",
     "            flags: 1, // FLAG_GRANT_READ_URI_PERMISSION",
     "            type: mime || 'application/octet-stream',",
     "          });",
     "          setToastMsg?.('');",
     "          return;",
     "        } catch (_) {",
     "          // Nothing registered for this type - fall through to sharing.",
     "        }",
     "      }",
     "",
     "      // iOS previews through Quick Look from here; also the Android",
     "      // fallback when no viewer app is installed for the type.",
     "      const canShare = await Sharing.isAvailableAsync();",
     "      if (canShare) {",
     "        await Sharing.shareAsync(localUri, {",
     "          mimeType: selectedItem.mimeType,",
     "          dialogTitle: selectedItem.name,",
     "        });",
     "      } else {",
     "        await Linking.openURL(localUri);",
     "      }"].join("\n"),
    "wallet: open in a viewer");

  wal = replaceOnce(wal,
    ["      </Modal>", "    </SafeAreaView>", "  );", "};"].join("\n"),
    ["      </Modal>",
     "",
     "      <Modal",
     "        visible={!!viewerUri}",
     '        animationType="fade"',
     "        onRequestClose={() => setViewerUri(null)}",
     "      >",
     "        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>",
     "          <View",
     "            style={{",
     "              flexDirection: 'row',",
     "              alignItems: 'center',",
     "              paddingHorizontal: 12,",
     "              paddingVertical: 10,",
     "            }}",
     "          >",
     "            <Pressable onPress={() => setViewerUri(null)} style={{ padding: 8 }}>",
     '              <X size={22} color="#fff" />',
     "            </Pressable>",
     "            <Text",
     "              numberOfLines={1}",
     "              style={{ color: '#fff', fontSize: 15, marginLeft: 6, flex: 1 }}",
     "            >",
     "              {viewerName}",
     "            </Text>",
     "          </View>",
     "          {viewerUri ? (",
     "            <Image",
     "              source={{ uri: viewerUri }}",
     "              style={{ flex: 1, width: '100%' }}",
     '              resizeMode="contain"',
     "            />",
     "          ) : null}",
     "        </SafeAreaView>",
     "      </Modal>",
     "    </SafeAreaView>",
     "  );",
     "};"].join("\n"),
    "wallet: full-screen image viewer");

  fs.writeFileSync(WAL, wal);
  console.log("PATCH: wallet files open in a viewer instead of the share sheet");
}

// --- v24: the login flow offered only three country codes -----------------
// A tester in Pakistan could not select +92 and so could never receive an OTP.
// ChooseModeScreen uses PhoneNumberModal, which hardcoded ['+1','+91','+41'],
// and behind that three more hardcodes would have kept most of the world out
// even after adding codes: a length !== 10 check, maxLength={10} on the field,
// and a Verify button that only lit up at exactly 10 digits. Swapped for
// react-native-phone-number-input - already a dependency, already used on the
// register screen - so login and register now behave the same. The modal
// chrome is untouched; only the input row inside it changes.
{
  const PM = "src/components/PhoneNumberModal/PhoneNumberModal.js";
  let pm = readMust(PM);

  pm = replaceOnce(pm,
    "import {shadow} from '../../constants/shadows';",
    "import {shadow} from '../../constants/shadows';\nimport PhoneInput from 'react-native-phone-number-input';",
    "phone modal: import the country picker");

  pm = replaceOnce(pm,
    "  const countryCodes = ['+1', '+91', '+41'];",
    [
      "  // The full international list now comes from react-native-phone-number-input,",
      "  // the same component the register screen already uses. This used to be a",
      "  // hardcoded ['+1', '+91', '+41'] - three countries - so a tester in Pakistan",
      "  // (+92) had no way to select their own country and could never receive an OTP.",
      "  const phoneInputRef = useRef(null);",
    ].join("\n"),
    "phone modal: drop the three-country array");

  pm = replaceOnce(pm,
    [
      "  const handleVerify = () => {",
      "    if (phoneNumber.length !== 10) {",
      "      setError(",
      "        phoneNumber.length === 0",
      "          ? 'Please enter your mobile number'",
      "          : 'Please enter a valid 10-digit mobile number',",
      "      );",
      "      return;",
      "    }",
      "    setError('');",
      "    onVerify(countryCode, phoneNumber);",
      "  };",
    ].join("\n"),
    [
      "  const handleVerify = () => {",
      "    const national = (phoneNumber || '').replace(/[^0-9]/g, '');",
      "    if (national.length === 0) {",
      "      setError('Please enter your mobile number');",
      "      return;",
      "    }",
      "    // National subscriber numbers run from 4 digits to 14 depending on the",
      "    // country. The old rule demanded exactly 10, which rejected valid numbers",
      "    // from most of the world - the UAE is 9, Singapore is 8.",
      "    if (national.length < 4 || national.length > 14) {",
      "      setError('Please enter a valid mobile number');",
      "      return;",
      "    }",
      "    let dial = countryCode;",
      "    try {",
      "      const cc = phoneInputRef.current?.getCallingCode?.();",
      "      if (cc) dial = '+' + String(cc).replace(/^\\+/, '');",
      "    } catch (_) {}",
      "    setError('');",
      "    onVerify(dial, national);",
      "  };",
    ].join("\n"),
    "phone modal: accept international lengths");

  const START = "                  <View style={styles.inputContainer}>";
  const END = "                  {error ? (";
  const s0 = pm.indexOf(START), e0 = pm.indexOf(END);
  if (s0 === -1 || e0 === -1 || e0 < s0) throw new Error("PATCH: phone modal input span anchors missing");
  if (pm.indexOf(START, s0 + START.length) !== -1) throw new Error("PATCH: phone modal start anchor not unique");
  const PICKER = [
    "                  <View style={styles.inputContainer}>",
    "                    <PhoneInput",
    "                      ref={phoneInputRef}",
    '                      defaultCode="IN"',
    '                      layout="first"',
    "                      value={phoneNumber}",
    "                      onChangeText={handlePhoneChange}",
    "                      countryPickerProps={{",
    "                        withFilter: true,",
    "                        withFlag: true,",
    "                        withCallingCode: true,",
    "                        withAlphaFilter: true,",
    "                        withEmoji: true,",
    "                      }}",
    "                      disableArrowIcon={false}",
    "                      modalProps={{presentationStyle: 'overFullScreen'}}",
    "                      containerStyle={{",
    "                        width: '100%',",
    "                        borderWidth: 1,",
    "                        borderColor: 'rgba(0, 191, 255, 0.3)',",
    "                        borderRadius: 12,",
    "                        backgroundColor: '#111C46',",
    "                      }}",
    "                      flagButtonStyle={{width: 70, marginLeft: 4}}",
    "                      textContainerStyle={{",
    "                        backgroundColor: 'transparent',",
    "                        paddingVertical: 0,",
    "                        borderLeftWidth: 1,",
    "                        borderLeftColor: 'rgba(0, 191, 255, 0.3)',",
    "                        paddingLeft: 10,",
    "                      }}",
    "                      codeTextStyle={{color: '#FFFFFF', fontSize: 16}}",
    "                      textInputProps={{",
    "                        keyboardType: 'phone-pad',",
    "                        placeholder: 'Phone number',",
    "                        placeholderTextColor: '#8B8CAD',",
    "                      }}",
    "                      textInputStyle={{color: '#FFFFFF', fontSize: 16, height: 50}}",
    "                      withDarkTheme",
    "                      withShadow={false}",
    "                    />",
    "                  </View>",
    "",
    "                  ",
  ].join("\n");
  pm = pm.slice(0, s0) + PICKER + pm.slice(e0);

  pm = replaceOnce(pm,
    "                        phoneNumber?.length === 10 ? '#2058E1' : '#111C46',",
    [
      "                        (phoneNumber || '').replace(/[^0-9]/g, '').length >= 4",
      "                          ? '#2058E1'",
      "                          : '#111C46',",
    ].join("\n"),
    "phone modal: verify button enablement");

  fs.writeFileSync(PM, pm);
  console.log("PATCH: login flow now offers every country code");
}

{
  const CM = "src/screens/Ghost/ChooseModeScreen.js";
  let cm = readMust(CM);
  cm = replaceOnce(cm,
    "      await SendMsg91Otp({phone: phoneWithoutPlus, flowType: 'register'});",
    [
      "      // Send the calling code as well. The full number already carries it,",
      "      // but the server builds the dial number from countryCode when present,",
      "      // and MSG91 rejects a bare national number with error 202.",
      "      const dialCode = String(countryCode || '').replace(/[^0-9]/g, '');",
      "      await SendMsg91Otp({",
      "        phone: phoneWithoutPlus,",
      "        countryCode: dialCode,",
      "        flowType: 'register',",
      "      });",
    ].join("\n"),
    "choose mode: send the calling code too");
  fs.writeFileSync(CM, cm);
  console.log("PATCH: login OTP request now carries the calling code");
}

// Amigo v25 - signup flow fixes (client's items 2, 3, 4)
//
//  (4) CRITICAL: creating an account bounced the user back to the login
//      screen. The backend DOES return a valid token from /create-user-info,
//      but onSuccess threw it away and reset the navigator to ChooseModeScreen
//      with "Please login". Now the token is stored and the user is taken
//      straight in - identical to the proven OTP login path.
//  (2) The profile picture was mandatory (hard early-return). It is now
//      optional. The backend already substitutes a default avatar when no
//      file is uploaded, so nothing server-side has to change.
//  (3) The gallery picker opened the system crop screen (allowsEditing:true)
//      which users could not get past. Cropping is now off.

{
const REG = "src/screen/account-creation/auth/register-user-screen/index.tsx";
let reg = readMust(REG);

if (reg.indexOf("signupLoginImports") !== -1) {
  console.log("PATCH: signup flow already patched - skipping");
} else {
  // ---- 1. imports -------------------------------------------------------
  reg = replaceOnce(
    reg,
    "import { useDispatch } from 'react-redux';",
    [
      "import { useDispatch } from 'react-redux';",
      "// signupLoginImports: same two imports the OTP login screen uses, so a",
      "// brand-new account is signed in exactly the way an existing one is.",
      "import { loginAction } from '../../../../redux/actions';",
      "import AsyncStorage from '@react-native-async-storage/async-storage';",
    ].join("\n"),
    "register screen: redux import"
  );

  // ---- 2. onSuccess: sign the new user in instead of kicking them out ---
  reg = replaceOnce(
    reg,
    [
      "    onSuccess: res => {",
      "      console.log('CREATE_USER_SUCCESS:', res);",
      "      setLoader(false);",
      "",
      "      if (res.status === 201) {",
      "        setToastMsg('Account created successfully! Please login.');",
      "        navigation.reset({",
      "          index: 0,",
      "          routes: [{name: 'ChooseModeScreen' as any}],",
      "        });",
      "      } else {",
      "        setToastMsg(res.message || 'User creation failed');",
      "      }",
      "    },",
    ].join("\n"),
    [
      "    onSuccess: async (res: any) => {",
      "      console.log('CREATE_USER_SUCCESS:', res);",
      "      setLoader(false);",
      "",
      "      // 201 = account created, 200 = existing record completed. Both are",
      "      // success and both come back with a signed token.",
      "      if (res?.status === 201 || res?.status === 200) {",
      "        const tokenToStore = res?.token || res?.data?.token || '';",
      "        if (tokenToStore) {",
      "          try {",
      "            await AsyncStorage.setItem('token', tokenToStore);",
      "          } catch (_) {}",
      "        }",
      "        // Stored only if the backend sends one; harmless when absent.",
      "        if (res?.refreshToken) {",
      "          try {",
      "            await AsyncStorage.setItem('refreshToken', res.refreshToken);",
      "          } catch (_) {}",
      "        }",
      "        dispatch(loginAction({...res}));",
      "        setToastMsg('Account created successfully!');",
      "        navigation.reset({",
      "          index: 0,",
      "          routes: [{name: 'WelcomeScreen' as any}],",
      "        });",
      "      } else {",
      "        setToastMsg(res?.message || 'User creation failed');",
      "      }",
      "    },",
    ].join("\n"),
    "register screen: onSuccess sign-in"
  );

  // ---- 3. profile picture is optional -----------------------------------
  reg = replaceOnce(
    reg,
    [
      "  const handleContinue = async (data: any) => {",
      "    if (!image) {",
      "      setToastMsg('Please select a profile picture');",
      "      return;",
      "    }",
      "",
      "    setLoader(true);",
    ].join("\n"),
    [
      "  const handleContinue = async (data: any) => {",
      "    // Profile picture is optional. When none is chosen the 'images' field",
      "    // is simply omitted and the backend falls back to its default avatar.",
      "    setLoader(true);",
    ].join("\n"),
    "register screen: optional profile picture"
  );

  // ---- 4. no forced crop screen -----------------------------------------
  reg = replaceOnce(
    reg,
    [
      "        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,",
      "        allowsEditing: true,",
      "        aspect: [1, 1],",
      "        quality: 0.8,",
    ].join("\n"),
    [
      "        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,",
      "        // Cropping off: the system crop screen was trapping users who",
      "        // could not find a way to confirm and continue.",
      "        allowsEditing: false,",
      "        selectionLimit: 1,",
      "        quality: 0.8,",
    ].join("\n"),
    "register screen: image picker no crop"
  );

  fs.writeFileSync(REG, reg);
  console.log("PATCH: signup now signs the new user in (was: bounced to login)");
  console.log("PATCH: profile picture optional");
  console.log("PATCH: gallery picker no longer forces the crop screen");
}
}

// ---------------------------------------------------------------------------
// v26 - signup / login flow re-verification fixes
// Each item below was found by walking the flow screen by screen and is
// reproducible from the code, not guessed.
// ---------------------------------------------------------------------------

{
  // (1) Every request made before login carried "Bearer undefined".
  //     loginData is {} during the whole signup flow, so the template string
  //     produced the literal text "Bearer undefined" - a TRUTHY header. The
  //     request interceptor only falls back to the stored token when the
  //     Authorization header is absent, so the real token was never attached.
  const NAV = "src/navigation/index.tsx";
  let nav = readMust(NAV);
  nav = replaceOnce(nav,
    [
      "  useEffect(() => {",
      "    const headers = {",
      "      Authorization: userData?.data?.token",
      "        ? `Bearer ${userData?.data?.token}`",
      "        : `Bearer ${userData?.token}`,",
      "      'Content-Type': 'application/json',",
      "    };",
      "    axios.defaults.headers.common = {...headers};",
      "  }, [userData]);",
    ].join("\n"),
    [
      "  useEffect(() => {",
      "    // Only set an Authorization default when a token actually exists.",
      "    // Previously this produced the literal string 'Bearer undefined'",
      "    // whenever loginData was empty (the entire signup flow). That string",
      "    // is truthy, so the request interceptor's fallback to the token in",
      "    // AsyncStorage never ran and every call went out unauthenticated.",
      "    const activeToken = userData?.data?.token || userData?.token || '';",
      "    const headers: any = {'Content-Type': 'application/json'};",
      "    if (activeToken) {",
      "      headers.Authorization = `Bearer ${activeToken}`;",
      "    }",
      "    axios.defaults.headers.common = {...headers};",
      "  }, [userData]);",
    ].join("\n"),
    "nav: no 'Bearer undefined' default");
  fs.writeFileSync(NAV, nav);
  console.log("PATCH: requests no longer go out with 'Bearer undefined'");
}

{
  // (2) A refreshed access token was never written back to storage, and an
  //     expired session left the persisted login in place - so the next app
  //     launch booted straight into the app with a dead token.
  const INT = "src/utils/apiInterceptor.ts";
  let int = readMust(INT);
  int = replaceOnce(int,
    [
      "          await AsyncStorage.setItem('refreshToken', newRefreshToken);",
    ].join("\n"),
    [
      "          // Persist BOTH halves. Only the refresh token used to be saved,",
      "          // so the stale access token stayed in storage and was re-sent",
      "          // after every restart.",
      "          if (newToken) {",
      "            await AsyncStorage.setItem('token', newToken);",
      "          }",
      "          if (newRefreshToken) {",
      "            await AsyncStorage.setItem('refreshToken', newRefreshToken);",
      "          }",
    ].join("\n"),
    "interceptor: persist refreshed access token");

  int = replaceOnce(int,
    [
      "          if (!refreshToken) {",
      "            processQueue(new Error('No refresh token'), null);",
      "            if (onSessionExpired) onSessionExpired();",
      "            return Promise.reject(error);",
      "          }",
    ].join("\n"),
    [
      "          if (!refreshToken) {",
      "            processQueue(new Error('No refresh token'), null);",
      "            await clearPersistedSession();",
      "            if (onSessionExpired) onSessionExpired();",
      "            return Promise.reject(error);",
      "          }",
    ].join("\n"),
    "interceptor: clear session when no refresh token");

  int = replaceOnce(int,
    [
      "            await AsyncStorage.removeItem('refreshToken');",
      "            if (onSessionExpired) onSessionExpired();",
    ].join("\n"),
    [
      "            await clearPersistedSession();",
      "            if (onSessionExpired) onSessionExpired();",
    ].join("\n"),
    "interceptor: clear session on refresh expiry");

  int = replaceOnce(int,
    "  axios.interceptors.response.use(",
    [
      "  // Wipe everything that makes the app think it is logged in. Removing",
      "  // only 'refreshToken' (the old behaviour) left persist:root and the",
      "  // access token behind, so the navigator's hasUser check stayed true and",
      "  // the next launch opened the app on a dead session.",
      "  const clearPersistedSession = async () => {",
      "    try { await AsyncStorage.removeItem('persist:root'); } catch (_) {}",
      "    try { await AsyncStorage.removeItem('token'); } catch (_) {}",
      "    try { await AsyncStorage.removeItem('refreshToken'); } catch (_) {}",
      "    try { delete axios.defaults.headers.common['Authorization']; } catch (_) {}",
      "  };",
      "",
      "  axios.interceptors.response.use(",
    ].join("\n"),
    "interceptor: clearPersistedSession helper");
  fs.writeFileSync(INT, int);
  console.log("PATCH: expired sessions are now cleared; refreshed token persisted");
}

{
  // (3) ChooseModeScreen: show the real reason an OTP could not be sent, keep
  //     the length rule in step with the modal, and carry the calling code
  //     forward so Resend can use it.
  const CM = "src/screens/Ghost/ChooseModeScreen.js";
  let cm = readMust(CM);
  cm = replaceOnce(cm,
    "    if (!phoneNumber || phoneNumber.length < 5) {",
    [
      "    // 4 is the shortest national subscriber number in use, and is also",
      "    // what the modal itself accepts - the two rules disagreed, so a valid",
      "    // 4-digit number passed the modal and was then rejected here.",
      "    if (!phoneNumber || phoneNumber.replace(/[^0-9]/g, '').length < 4) {",
    ].join("\n"),
    "choose mode: phone length rule matches the modal");

  cm = replaceOnce(cm,
    [
      "      navigation.navigate('OtpScreen', {",
      "        phone: fullPhone,",
      "        flowType: 'auto',",
      "      });",
    ].join("\n"),
    [
      "      navigation.navigate('OtpScreen', {",
      "        phone: fullPhone,",
      "        // Carried forward so Resend can send the same calling code this",
      "        // first request used. Without it MSG91 rejects the resend with",
      "        // error 202 for every non-Indian number.",
      "        countryCode: dialCode,",
      "        flowType: 'auto',",
      "      });",
    ].join("\n"),
    "choose mode: pass countryCode to the OTP screen");

  cm = replaceOnce(cm,
    [
      "    } catch (error) {",
      "      setLoader(false);",
      "      setToastMsg('Failed to send OTP. Please try again.');",
      "      setShowPhoneModal(true);",
      "      console.log('handlePhoneVerify error:', error);",
      "    }",
    ].join("\n"),
    [
      "    } catch (error) {",
      "      setLoader(false);",
      "      // Surface what the server actually said. The blanket message hid",
      "      // 'number not supported', rate limits and outages behind one string,",
      "      // so users retried a request that could never succeed.",
      "      const serverMsg = error?.response?.data?.message;",
      "      setToastMsg(",
      "        error?.isNetworkError",
      "          ? 'No internet connection. Please check your network and try again.'",
      "          : serverMsg || 'Failed to send OTP. Please try again.',",
      "      );",
      "      setShowPhoneModal(true);",
      "      console.log('handlePhoneVerify error:', error);",
      "    }",
    ].join("\n"),
    "choose mode: real OTP send error");
  fs.writeFileSync(CM, cm);
  console.log("PATCH: OTP send errors are readable; calling code carried forward");
}

{
  // (4) OtpScreen: a dropped connection was reported as a wrong OTP (and wiped
  //     the code the user had just typed); Resend dropped the calling code;
  //     a 'login' response with no token still reset the navigator.
  const OTP = "src/screen/account-creation/auth/otp-screen/index.tsx";
  let otp = readMust(OTP);

  otp = replaceOnce(otp,
    "  const {phone, flowType} = route.params || {};",
    "  const {phone, countryCode, flowType} = route.params || {};",
    "otp screen: read countryCode param");

  otp = replaceOnce(otp,
    [
      "      if (isExistingUser && loginResponse) {",
      "        const tokenToStore = loginResponse?.token || loginResponse?.data?.token || '';",
      "        if (tokenToStore) {",
      "          await AsyncStorage.setItem('token', tokenToStore);",
      "        }",
    ].join("\n"),
    [
      "      if (isExistingUser && loginResponse) {",
      "        const tokenToStore = loginResponse?.token || loginResponse?.data?.token || '';",
      "        if (!tokenToStore) {",
      "          // Without a token the app would reset to WelcomeScreen with no",
      "          // usable session and no way back - every later call would 401.",
      "          setErrorMessage(",
      "            'Could not complete sign in. Please try again.',",
      "          );",
      "          setOtp(['', '', '', '', '', '']);",
      "          inputRefs.current[0]?.focus();",
      "          return;",
      "        }",
      "        await AsyncStorage.setItem('token', tokenToStore);",
    ].join("\n"),
    "otp screen: require a token before signing in");

  otp = replaceOnce(otp,
    [
      "    } catch (error: any) {",
      "      setErrorMessage(",
      "        error?.response?.data?.message || 'Invalid OTP. Please try again.',",
      "      );",
      "      setOtp(['', '', '', '', '', '']);",
      "      inputRefs.current[0]?.focus();",
      "    } finally {",
      "      setIsVerifying(false);",
      "    }",
    ].join("\n"),
    [
      "    } catch (error: any) {",
      "      // A timeout or a dropped connection is NOT a wrong code. Telling the",
      "      // user their correct OTP was invalid - and clearing all six boxes -",
      "      // was the single most confusing moment in the flow.",
      "      if (error?.isNetworkError) {",
      "        setErrorMessage(",
      "          error?.message ||",
      "            'Network error. Please check your connection and try again.',",
      "        );",
      "      } else {",
      "        setErrorMessage(",
      "          error?.response?.data?.message || 'Invalid OTP. Please try again.',",
      "        );",
      "        setOtp(['', '', '', '', '', '']);",
      "        inputRefs.current[0]?.focus();",
      "      }",
      "    } finally {",
      "      setIsVerifying(false);",
      "    }",
    ].join("\n"),
    "otp screen: network errors are not 'invalid OTP'");

  otp = replaceOnce(otp,
    "      await SendMsg91Otp({phone: phoneWithoutPlus, flowType: 'register'});",
    [
      "      // Same calling code the first request used - see ChooseModeScreen.",
      "      const dialCode = String(countryCode || '').replace(/[^0-9]/g, '');",
      "      await SendMsg91Otp({",
      "        phone: phoneWithoutPlus,",
      "        ...(dialCode ? {countryCode: dialCode} : {}),",
      "        flowType: 'register',",
      "      });",
    ].join("\n"),
    "otp screen: resend carries the calling code");

  otp = replaceOnce(otp,
    [
      "      setIsResending(false);",
      "      setErrorMessage(",
      "        error?.response?.data?.message || 'Failed to resend OTP. Please try again.',",
      "      );",
    ].join("\n"),
    [
      "      setIsResending(false);",
      "      setErrorMessage(",
      "        error?.isNetworkError",
      "          ? error?.message || 'Network error. Please check your connection.'",
      "          : error?.response?.data?.message ||",
      "            'Failed to resend OTP. Please try again.',",
      "      );",
    ].join("\n"),
    "otp screen: resend error wording");
  fs.writeFileSync(OTP, otp);
  console.log("PATCH: OTP screen - network errors, resend calling code, token required");
}

{
  // (5) PhoneNumberModal: keep the dial-code state in step with the picker
  //     (it was only ever the '+91' default, used as a silent fallback), and
  //     stop discarding a typed number when the user taps outside.
  const PM = "src/components/PhoneNumberModal/PhoneNumberModal.js";
  let pm = readMust(PM);

  pm = replaceOnce(pm,
    [
      "  const handleClose = () => {",
      "    setPhoneNumber('');",
      "    setShowDropdown(false);",
      "    setIsLoading(false);",
      "    setError('');",
      "    onClose();",
      "  };",
    ].join("\n"),
    [
      "  const handleClose = () => {",
      "    // The number is deliberately kept. Tapping just outside the card used",
      "    // to erase everything the user had typed, with no confirmation.",
      "    setShowDropdown(false);",
      "    setIsLoading(false);",
      "    setError('');",
      "    onClose();",
      "  };",
    ].join("\n"),
    "phone modal: do not wipe the typed number on close");
  fs.writeFileSync(PM, pm);
  console.log("PATCH: phone modal keeps the typed number and tracks the picker");
}

{
  // (6) Register screen: a verified email could never be corrected. The field
  //     is set editable={!isEmailVerified}, so the onChangeText branch that was
  //     meant to un-verify it could never fire - a typo'd address was final.
  //     Also surface what the server actually said instead of one blanket line.
  const REG = "src/screen/account-creation/auth/register-user-screen/index.tsx";
  let reg = readMust(REG);

  reg = replaceOnce(reg,
    [
      "      const errorMessage =",
      "        error?.response?.data?.message || 'Something went wrong';",
    ].join("\n"),
    [
      "      // 'Something went wrong' hid the one thing the user could act on -",
      "      // most often a 409 telling them the username or email is taken.",
      "      const errorMessage = error?.isNetworkError",
      "        ? error?.message ||",
      "          'Network error. Please check your connection and try again.'",
      "        : error?.response?.data?.errors?.[0] ||",
      "          error?.response?.data?.message ||",
      "          'Something went wrong. Please try again.';",
    ].join("\n"),
    "register screen: readable submit errors");

  reg = replaceOnce(reg,
    "                      editable={!isEmailVerified}",
    [
      "                      // Stays editable so a mistyped address can be fixed.",
      "                      // The onChangeText handler above clears the verified",
      "                      // flag, which it could never do while this was false.",
      "                      editable={true}",
    ].join("\n"),
    "register screen: verified email can be corrected");
  fs.writeFileSync(REG, reg);
  console.log("PATCH: register screen - real errors, verified email can be corrected");
}

// ---------------------------------------------------------------------------
// v26 - "New Amigo Version Available" push with a store deep link (item 6)
//
// Backend contract (data-only keys, all optional except type):
//   type       : "app_update"   (also accepted: "update", "new_version")
//   androidUrl : full Play Store URL            - optional, default below
//   iosUrl     : full App Store URL             - REQUIRED for iOS until the
//                                                 app has a numeric Store id
//   url        : used for whichever platform has no specific key
//   version    : shown in the notification body by the backend, not used here
//
// Tapping the notification opens the correct store for the device. Nothing
// else in the tap pipeline changes - the crowd/chat routing is untouched and
// still runs for every non-update payload.
// ---------------------------------------------------------------------------

{
  const NOTIF = "src/utils/notification.ts";
  let n = readMust(NOTIF);

  n = replaceOnce(n,
    "import { Platform } from 'react-native';",
    "import { Linking, Platform } from 'react-native';",
    "notification: Linking import");

  n = replaceOnce(n,
    [
      "// A single tap can surface through more than one channel (expo listener",
      "// and Firebase). Collapse duplicates inside a short window.",
    ].join("\n"),
    [
      "// ---- App-update push -------------------------------------------------",
      "// The store listing the app was installed from. ANDROID_PACKAGE matches",
      "// applicationId in android/app/build.gradle. IOS_APP_ID is the numeric id",
      "// Apple assigns once the app exists in App Store Connect - until it is",
      "// filled in, an iOS update push must carry iosUrl (or url) in its data.",
      "const ANDROID_PACKAGE = 'com.amigoapp';",
      "const IOS_APP_ID = '';",
      "",
      "const isUpdatePayload = (data: any): boolean => {",
      "  const t = String(data?.type || data?.notificationType || '').toLowerCase();",
      "  return t === 'app_update' || t === 'update' || t === 'new_version';",
      "};",
      "",
      "const storeUrlFor = (data: any): string | null => {",
      "  const generic = data?.url || data?.storeUrl || '';",
      "  if (Platform.OS === 'ios') {",
      "    const ios = data?.iosUrl || data?.appStoreUrl || generic;",
      "    if (ios) return String(ios);",
      "    return IOS_APP_ID",
      "      ? 'https://apps.apple.com/app/id' + IOS_APP_ID",
      "      : null;",
      "  }",
      "  const android = data?.androidUrl || data?.playStoreUrl || generic;",
      "  if (android) return String(android);",
      "  return 'https://play.google.com/store/apps/details?id=' + ANDROID_PACKAGE;",
      "};",
      "",
      "// Opens the store app when it is installed, and falls back to the web",
      "// listing when it is not (or when the market:// intent is unavailable).",
      "const openStore = async (data: any) => {",
      "  const httpsUrl = storeUrlFor(data);",
      "  if (!httpsUrl) {",
      "    diag('update.noStoreUrl', 'iOS update push had no iosUrl/url and no IOS_APP_ID is set');",
      "    return;",
      "  }",
      "  if (Platform.OS === 'android') {",
      "    const nativeUrl = httpsUrl.indexOf('play.google.com') !== -1",
      "      ? httpsUrl.replace(",
      "          /^https?:\\/\\/play\\.google\\.com\\/store\\/apps\\/details\\?/,",
      "          'market://details?',",
      "        )",
      "      : httpsUrl;",
      "    if (nativeUrl !== httpsUrl) {",
      "      try {",
      "        await Linking.openURL(nativeUrl);",
      "        diag('update.opened', nativeUrl);",
      "        return;",
      "      } catch (_) {}",
      "    }",
      "  } else {",
      "    const nativeUrl = httpsUrl.replace(",
      "      /^https?:\\/\\/apps\\.apple\\.com\\//,",
      "      'itms-apps://apps.apple.com/',",
      "    );",
      "    if (nativeUrl !== httpsUrl) {",
      "      try {",
      "        await Linking.openURL(nativeUrl);",
      "        diag('update.opened', nativeUrl);",
      "        return;",
      "      } catch (_) {}",
      "    }",
      "  }",
      "  try {",
      "    await Linking.openURL(httpsUrl);",
      "    diag('update.opened', httpsUrl);",
      "  } catch (e) {",
      "    diag('update.openFailed', String(e));",
      "  }",
      "};",
      "",
      "// A single tap can surface through more than one channel (expo listener",
      "// and Firebase). Collapse duplicates inside a short window.",
    ].join("\n"),
    "notification: store-link helpers");

  n = replaceOnce(n,
    [
      "  lastTapKey = key;",
      "  lastTapAt = now;",
    ].join("\n"),
    [
      "  lastTapKey = key;",
      "  lastTapAt = now;",
      "",
      "  // 'New Amigo Version Available' - send the user to the store and stop.",
      "  // Checked before the crowd routing so an update push never opens a chat.",
      "  if (isUpdatePayload(data)) {",
      "    diag('tap.appUpdate', data);",
      "    openStore(data);",
      "    return;",
      "  }",
    ].join("\n"),
    "notification: route update taps to the store");

  fs.writeFileSync(NOTIF, n);
  console.log("PATCH: update pushes now open the right app store");
}

{
  // Android 11+ package visibility: without a matching <queries> entry,
  // Linking.openURL('market://...') fails with "No Activity found".
  const MANIFEST = "android/app/src/main/AndroidManifest.xml";
  let m = readMust(MANIFEST);
  m = replaceOnce(m,
    [
      "  <queries>",
      "    <intent>",
      "      <action android:name=\"android.intent.action.VIEW\"/>",
      "      <category android:name=\"android.intent.category.BROWSABLE\"/>",
      "      <data android:scheme=\"https\"/>",
      "    </intent>",
      "  </queries>",
    ].join("\n"),
    [
      "  <queries>",
      "    <intent>",
      "      <action android:name=\"android.intent.action.VIEW\"/>",
      "      <category android:name=\"android.intent.category.BROWSABLE\"/>",
      "      <data android:scheme=\"https\"/>",
      "    </intent>",
      "    <!-- Lets the app resolve market:// so an update notification can open",
      "         the Play Store app directly on Android 11 and above. -->",
      "    <intent>",
      "      <action android:name=\"android.intent.action.VIEW\"/>",
      "      <data android:scheme=\"market\"/>",
      "    </intent>",
      "  </queries>",
    ].join("\n"),
    "manifest: market:// query");
  fs.writeFileSync(MANIFEST, m);
  console.log("PATCH: manifest can resolve market:// (Play Store deep link)");
}

const COUNTRIES_SRC = "// Auto-generated ISO-3166 country list with E.164 calling codes.\n// [iso2, name, dialCode] - kept as a flat array to stay small in the bundle.\nexport const COUNTRIES = [\n  ['AF', 'Afghanistan', '+93'],\n  ['AL', 'Albania', '+355'],\n  ['DZ', 'Algeria', '+213'],\n  ['AS', 'American Samoa', '+1'],\n  ['AD', 'Andorra', '+376'],\n  ['AO', 'Angola', '+244'],\n  ['AI', 'Anguilla', '+1'],\n  ['AG', 'Antigua and Barbuda', '+1'],\n  ['AR', 'Argentina', '+54'],\n  ['AM', 'Armenia', '+374'],\n  ['AW', 'Aruba', '+297'],\n  ['AU', 'Australia', '+61'],\n  ['AT', 'Austria', '+43'],\n  ['AZ', 'Azerbaijan', '+994'],\n  ['BS', 'Bahamas', '+1'],\n  ['BH', 'Bahrain', '+973'],\n  ['BD', 'Bangladesh', '+880'],\n  ['BB', 'Barbados', '+1'],\n  ['BY', 'Belarus', '+375'],\n  ['BE', 'Belgium', '+32'],\n  ['BZ', 'Belize', '+501'],\n  ['BJ', 'Benin', '+229'],\n  ['BM', 'Bermuda', '+1'],\n  ['BT', 'Bhutan', '+975'],\n  ['BO', 'Bolivia', '+591'],\n  ['BA', 'Bosnia and Herzegovina', '+387'],\n  ['BW', 'Botswana', '+267'],\n  ['BV', 'Bouvet Island', '+47'],\n  ['BR', 'Brazil', '+55'],\n  ['IO', 'British Indian Ocean Territory', '+246'],\n  ['VG', 'British Virgin Islands', '+1'],\n  ['BN', 'Brunei', '+673'],\n  ['BG', 'Bulgaria', '+359'],\n  ['BF', 'Burkina Faso', '+226'],\n  ['BI', 'Burundi', '+257'],\n  ['KH', 'Cambodia', '+855'],\n  ['CM', 'Cameroon', '+237'],\n  ['CA', 'Canada', '+1'],\n  ['CV', 'Cape Verde', '+238'],\n  ['BQ', 'Caribbean Netherlands', '+599'],\n  ['KY', 'Cayman Islands', '+1'],\n  ['CF', 'Central African Republic', '+236'],\n  ['TD', 'Chad', '+235'],\n  ['CL', 'Chile', '+56'],\n  ['CN', 'China', '+86'],\n  ['CX', 'Christmas Island', '+61'],\n  ['CC', 'Cocos (Keeling) Islands', '+61'],\n  ['CO', 'Colombia', '+57'],\n  ['KM', 'Comoros', '+269'],\n  ['CG', 'Congo', '+242'],\n  ['CK', 'Cook Islands', '+682'],\n  ['CR', 'Costa Rica', '+506'],\n  ['HR', 'Croatia', '+385'],\n  ['CU', 'Cuba', '+53'],\n  ['CW', 'Cura\u00e7ao', '+599'],\n  ['CY', 'Cyprus', '+357'],\n  ['CZ', 'Czechia', '+420'],\n  ['CD', 'DR Congo', '+243'],\n  ['DK', 'Denmark', '+45'],\n  ['DJ', 'Djibouti', '+253'],\n  ['DM', 'Dominica', '+1'],\n  ['DO', 'Dominican Republic', '+1'],\n  ['EC', 'Ecuador', '+593'],\n  ['EG', 'Egypt', '+20'],\n  ['SV', 'El Salvador', '+503'],\n  ['GQ', 'Equatorial Guinea', '+240'],\n  ['ER', 'Eritrea', '+291'],\n  ['EE', 'Estonia', '+372'],\n  ['SZ', 'Eswatini', '+268'],\n  ['ET', 'Ethiopia', '+251'],\n  ['FK', 'Falkland Islands', '+500'],\n  ['FO', 'Faroe Islands', '+298'],\n  ['FJ', 'Fiji', '+679'],\n  ['FI', 'Finland', '+358'],\n  ['FR', 'France', '+33'],\n  ['GF', 'French Guiana', '+594'],\n  ['PF', 'French Polynesia', '+689'],\n  ['TF', 'French Southern and Antarctic Lands', '+262'],\n  ['GA', 'Gabon', '+241'],\n  ['GM', 'Gambia', '+220'],\n  ['GE', 'Georgia', '+995'],\n  ['DE', 'Germany', '+49'],\n  ['GH', 'Ghana', '+233'],\n  ['GI', 'Gibraltar', '+350'],\n  ['GR', 'Greece', '+30'],\n  ['GL', 'Greenland', '+299'],\n  ['GD', 'Grenada', '+1'],\n  ['GP', 'Guadeloupe', '+590'],\n  ['GU', 'Guam', '+1'],\n  ['GT', 'Guatemala', '+502'],\n  ['GG', 'Guernsey', '+44'],\n  ['GN', 'Guinea', '+224'],\n  ['GW', 'Guinea-Bissau', '+245'],\n  ['GY', 'Guyana', '+592'],\n  ['HT', 'Haiti', '+509'],\n  ['HN', 'Honduras', '+504'],\n  ['HK', 'Hong Kong', '+852'],\n  ['HU', 'Hungary', '+36'],\n  ['IS', 'Iceland', '+354'],\n  ['IN', 'India', '+91'],\n  ['ID', 'Indonesia', '+62'],\n  ['IR', 'Iran', '+98'],\n  ['IQ', 'Iraq', '+964'],\n  ['IE', 'Ireland', '+353'],\n  ['IM', 'Isle of Man', '+44'],\n  ['IL', 'Israel', '+972'],\n  ['IT', 'Italy', '+39'],\n  ['CI', 'Ivory Coast', '+225'],\n  ['JM', 'Jamaica', '+1'],\n  ['JP', 'Japan', '+81'],\n  ['JE', 'Jersey', '+44'],\n  ['JO', 'Jordan', '+962'],\n  ['KZ', 'Kazakhstan', '+7'],\n  ['KE', 'Kenya', '+254'],\n  ['KI', 'Kiribati', '+686'],\n  ['XK', 'Kosovo', '+383'],\n  ['KW', 'Kuwait', '+965'],\n  ['KG', 'Kyrgyzstan', '+996'],\n  ['LA', 'Laos', '+856'],\n  ['LV', 'Latvia', '+371'],\n  ['LB', 'Lebanon', '+961'],\n  ['LS', 'Lesotho', '+266'],\n  ['LR', 'Liberia', '+231'],\n  ['LY', 'Libya', '+218'],\n  ['LI', 'Liechtenstein', '+423'],\n  ['LT', 'Lithuania', '+370'],\n  ['LU', 'Luxembourg', '+352'],\n  ['MO', 'Macau', '+853'],\n  ['MG', 'Madagascar', '+261'],\n  ['MW', 'Malawi', '+265'],\n  ['MY', 'Malaysia', '+60'],\n  ['MV', 'Maldives', '+960'],\n  ['ML', 'Mali', '+223'],\n  ['MT', 'Malta', '+356'],\n  ['MH', 'Marshall Islands', '+692'],\n  ['MQ', 'Martinique', '+596'],\n  ['MR', 'Mauritania', '+222'],\n  ['MU', 'Mauritius', '+230'],\n  ['YT', 'Mayotte', '+262'],\n  ['MX', 'Mexico', '+52'],\n  ['FM', 'Micronesia', '+691'],\n  ['MD', 'Moldova', '+373'],\n  ['MC', 'Monaco', '+377'],\n  ['MN', 'Mongolia', '+976'],\n  ['ME', 'Montenegro', '+382'],\n  ['MS', 'Montserrat', '+1'],\n  ['MA', 'Morocco', '+212'],\n  ['MZ', 'Mozambique', '+258'],\n  ['MM', 'Myanmar', '+95'],\n  ['NA', 'Namibia', '+264'],\n  ['NR', 'Nauru', '+674'],\n  ['NP', 'Nepal', '+977'],\n  ['NL', 'Netherlands', '+31'],\n  ['NC', 'New Caledonia', '+687'],\n  ['NZ', 'New Zealand', '+64'],\n  ['NI', 'Nicaragua', '+505'],\n  ['NE', 'Niger', '+227'],\n  ['NG', 'Nigeria', '+234'],\n  ['NU', 'Niue', '+683'],\n  ['NF', 'Norfolk Island', '+672'],\n  ['KP', 'North Korea', '+850'],\n  ['MK', 'North Macedonia', '+389'],\n  ['MP', 'Northern Mariana Islands', '+1'],\n  ['NO', 'Norway', '+47'],\n  ['OM', 'Oman', '+968'],\n  ['PK', 'Pakistan', '+92'],\n  ['PW', 'Palau', '+680'],\n  ['PS', 'Palestine', '+970'],\n  ['PA', 'Panama', '+507'],\n  ['PG', 'Papua New Guinea', '+675'],\n  ['PY', 'Paraguay', '+595'],\n  ['PE', 'Peru', '+51'],\n  ['PH', 'Philippines', '+63'],\n  ['PN', 'Pitcairn Islands', '+64'],\n  ['PL', 'Poland', '+48'],\n  ['PT', 'Portugal', '+351'],\n  ['PR', 'Puerto Rico', '+1'],\n  ['QA', 'Qatar', '+974'],\n  ['RO', 'Romania', '+40'],\n  ['RU', 'Russia', '+7'],\n  ['RW', 'Rwanda', '+250'],\n  ['RE', 'R\u00e9union', '+262'],\n  ['BL', 'Saint Barth\u00e9lemy', '+590'],\n  ['SH', 'Saint Helena, Ascension and Tristan da Cunha', '+2'],\n  ['KN', 'Saint Kitts and Nevis', '+1'],\n  ['LC', 'Saint Lucia', '+1'],\n  ['MF', 'Saint Martin', '+590'],\n  ['PM', 'Saint Pierre and Miquelon', '+508'],\n  ['VC', 'Saint Vincent and the Grenadines', '+1'],\n  ['WS', 'Samoa', '+685'],\n  ['SM', 'San Marino', '+378'],\n  ['SA', 'Saudi Arabia', '+966'],\n  ['SN', 'Senegal', '+221'],\n  ['RS', 'Serbia', '+381'],\n  ['SC', 'Seychelles', '+248'],\n  ['SL', 'Sierra Leone', '+232'],\n  ['SG', 'Singapore', '+65'],\n  ['SX', 'Sint Maarten', '+1'],\n  ['SK', 'Slovakia', '+421'],\n  ['SI', 'Slovenia', '+386'],\n  ['SB', 'Solomon Islands', '+677'],\n  ['SO', 'Somalia', '+252'],\n  ['ZA', 'South Africa', '+27'],\n  ['GS', 'South Georgia', '+500'],\n  ['KR', 'South Korea', '+82'],\n  ['SS', 'South Sudan', '+211'],\n  ['ES', 'Spain', '+34'],\n  ['LK', 'Sri Lanka', '+94'],\n  ['SD', 'Sudan', '+249'],\n  ['SR', 'Suriname', '+597'],\n  ['SJ', 'Svalbard and Jan Mayen', '+4779'],\n  ['SE', 'Sweden', '+46'],\n  ['CH', 'Switzerland', '+41'],\n  ['SY', 'Syria', '+963'],\n  ['ST', 'S\u00e3o Tom\u00e9 and Pr\u00edncipe', '+239'],\n  ['TW', 'Taiwan', '+886'],\n  ['TJ', 'Tajikistan', '+992'],\n  ['TZ', 'Tanzania', '+255'],\n  ['TH', 'Thailand', '+66'],\n  ['TL', 'Timor-Leste', '+670'],\n  ['TG', 'Togo', '+228'],\n  ['TK', 'Tokelau', '+690'],\n  ['TO', 'Tonga', '+676'],\n  ['TT', 'Trinidad and Tobago', '+1'],\n  ['TN', 'Tunisia', '+216'],\n  ['TM', 'Turkmenistan', '+993'],\n  ['TC', 'Turks and Caicos Islands', '+1'],\n  ['TV', 'Tuvalu', '+688'],\n  ['TR', 'T\u00fcrkiye', '+90'],\n  ['UG', 'Uganda', '+256'],\n  ['UA', 'Ukraine', '+380'],\n  ['AE', 'United Arab Emirates', '+971'],\n  ['GB', 'United Kingdom', '+44'],\n  ['US', 'United States', '+1'],\n  ['UM', 'United States Minor Outlying Islands', '+268'],\n  ['VI', 'United States Virgin Islands', '+1'],\n  ['UY', 'Uruguay', '+598'],\n  ['UZ', 'Uzbekistan', '+998'],\n  ['VU', 'Vanuatu', '+678'],\n  ['VA', 'Vatican City', '+3'],\n  ['VE', 'Venezuela', '+58'],\n  ['VN', 'Vietnam', '+84'],\n  ['WF', 'Wallis and Futuna', '+681'],\n  ['EH', 'Western Sahara', '+2'],\n  ['YE', 'Yemen', '+967'],\n  ['ZM', 'Zambia', '+260'],\n  ['ZW', 'Zimbabwe', '+263'],\n  ['AX', '\u00c5land Islands', '+35818'],\n];\n\n// The twelve shown in the POPULAR grid, in the order the design specifies.\nexport const POPULAR_ISO = ['US', 'GB', 'IN', 'CA', 'AU', 'DE', 'FR', 'BR', 'JP', 'AE', 'SG', 'MX'];\n\n// flagcdn serves real PNG flags. Android has no flag-emoji font, so emoji\n// flags render as two grey letters there - images are the only way to show\n// the design's flags on both platforms.\nexport const flagUrl = (iso, width) =>\n  'https://flagcdn.com/w' + (width || 40) + '/' + String(iso).toLowerCase() + '.png';\n";
const SHEET_SRC = "import React, {useMemo, useState} from 'react';\nimport {\n  FlatList,\n  Image,\n  Modal,\n  StyleSheet,\n  Text,\n  TextInput,\n  TouchableOpacity,\n  View,\n} from 'react-native';\nimport {Search, X} from 'lucide-react-native';\nimport {FontFamily} from '../../../GlobalStyles';\nimport {COUNTRIES, POPULAR_ISO, flagUrl} from './countries';\n\n// Real PNG flag. Falls back to a plain box if the image cannot be fetched,\n// so a country is never rendered as an empty gap.\nconst Flag = ({iso, width, height}) => {\n  const [failed, setFailed] = useState(false);\n  if (failed) {\n    return <View style={[styles.flagFallback, {width, height}]} />;\n  }\n  return (\n    <Image\n      source={{uri: flagUrl(iso, width <= 24 ? 40 : 80)}}\n      style={{width, height, borderRadius: 2}}\n      resizeMode=\"cover\"\n      onError={() => setFailed(true)}\n    />\n  );\n};\n\nconst byIso = {};\nCOUNTRIES.forEach(c => {\n  byIso[c[0]] = c;\n});\n\nconst CountryCodeSheet = ({visible, selectedIso, onSelect, onClose}) => {\n  const [query, setQuery] = useState('');\n\n  const searching = query.trim().length > 0;\n\n  const results = useMemo(() => {\n    const q = query.trim().toLowerCase();\n    if (!q) return [];\n    const digits = q.replace(/[^0-9]/g, '');\n    return COUNTRIES.filter(c => {\n      const name = c[1].toLowerCase();\n      if (name.indexOf(q) !== -1) return true;\n      if (c[0].toLowerCase() === q) return true;\n      if (digits && c[2].replace('+', '').indexOf(digits) === 0) return true;\n      return false;\n    });\n  }, [query]);\n\n  const popular = POPULAR_ISO.map(iso => byIso[iso]).filter(Boolean);\n\n  const close = () => {\n    setQuery('');\n    onClose();\n  };\n\n  const pick = country => {\n    setQuery('');\n    onSelect(country);\n  };\n\n  const renderRow = ({item}) => (\n    <TouchableOpacity\n      style={styles.row}\n      activeOpacity={0.7}\n      onPress={() => pick(item)}>\n      <Flag iso={item[0]} width={22} height={16} />\n      <Text style={styles.rowName} numberOfLines={1}>\n        {item[1]}\n      </Text>\n      <Text style={styles.rowDial}>{item[2]}</Text>\n    </TouchableOpacity>\n  );\n\n  return (\n    <Modal\n      visible={visible}\n      transparent\n      animationType=\"slide\"\n      statusBarTranslucent\n      onRequestClose={close}>\n      <View style={styles.backdrop}>\n        <TouchableOpacity\n          style={styles.backdropTap}\n          activeOpacity={1}\n          onPress={close}\n        />\n        <View style={styles.sheet}>\n          <View style={styles.handle} />\n\n          <View style={styles.header}>\n            <Text style={styles.headerTitle}>Country code</Text>\n            <TouchableOpacity\n              style={styles.closeBtn}\n              activeOpacity={0.8}\n              onPress={close}>\n              <X color=\"#A9ADC7\" size={18} />\n            </TouchableOpacity>\n          </View>\n\n          <View style={styles.searchWrap}>\n            <Search color=\"#6B7090\" size={17} style={styles.searchIcon} />\n            <TextInput\n              style={styles.searchInput}\n              placeholder=\"Search country or dial code...\"\n              placeholderTextColor=\"#6B7090\"\n              value={query}\n              onChangeText={setQuery}\n              autoCorrect={false}\n              autoCapitalize=\"none\"\n            />\n            {searching ? (\n              <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.8}>\n                <X color=\"#6B7090\" size={16} style={styles.clearGlyph} />\n              </TouchableOpacity>\n            ) : null}\n          </View>\n\n          {searching ? (\n            results.length ? (\n              <FlatList\n                data={results}\n                keyExtractor={(item, i) => item[0] + '_' + i}\n                renderItem={renderRow}\n                keyboardShouldPersistTaps=\"handled\"\n                style={styles.list}\n              />\n            ) : (\n              <View style={styles.emptyWrap}>\n                <Text style={styles.emptyText}>No countries match \u201c{query}\u201d</Text>\n              </View>\n            )\n          ) : (\n            <FlatList\n              data={COUNTRIES}\n              keyExtractor={(item, i) => item[0] + '_' + i}\n              renderItem={renderRow}\n              keyboardShouldPersistTaps=\"handled\"\n              style={styles.list}\n              ListHeaderComponent={\n                <View>\n                  <Text style={styles.sectionLabel}>POPULAR</Text>\n                  <View style={styles.grid}>\n                    {popular.map(c => {\n                      const active = c[0] === selectedIso;\n                      return (\n                        <TouchableOpacity\n                          key={c[0]}\n                          style={[styles.tile, active && styles.tileActive]}\n                          activeOpacity={0.8}\n                          onPress={() => pick(c)}>\n                          <Flag iso={c[0]} width={28} height={20} />\n                          <Text\n                            style={[\n                              styles.tileDial,\n                              active && styles.tileDialActive,\n                            ]}>\n                            {c[2]}\n                          </Text>\n                        </TouchableOpacity>\n                      );\n                    })}\n                  </View>\n                  <Text style={styles.sectionLabel}>ALL COUNTRIES</Text>\n                </View>\n              }\n            />\n          )}\n        </View>\n      </View>\n    </Modal>\n  );\n};\n\nexport default CountryCodeSheet;\n\nconst styles = StyleSheet.create({\n  backdrop: {flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end'},\n  backdropTap: {flex: 1},\n  sheet: {\n    height: '78%',\n    backgroundColor: '#0B0B18',\n    borderTopLeftRadius: 24,\n    borderTopRightRadius: 24,\n    borderWidth: 1,\n    borderColor: 'rgba(255,255,255,0.08)',\n    paddingHorizontal: 18,\n    paddingTop: 10,\n  },\n  handle: {\n    alignSelf: 'center',\n    width: 40,\n    height: 4,\n    borderRadius: 2,\n    backgroundColor: 'rgba(255,255,255,0.25)',\n    marginBottom: 14,\n  },\n  header: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    justifyContent: 'space-between',\n    marginBottom: 14,\n  },\n  headerTitle: {\n    fontFamily: FontFamily.robotoBold,\n    fontWeight: '700',\n    fontSize: 20,\n    color: '#FFFFFF',\n  },\n  closeBtn: {\n    width: 32,\n    height: 32,\n    borderRadius: 16,\n    backgroundColor: '#1C1C33',\n    alignItems: 'center',\n    justifyContent: 'center',\n  },\n  searchWrap: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    backgroundColor: '#121226',\n    borderRadius: 12,\n    borderWidth: 1,\n    borderColor: 'rgba(255,255,255,0.06)',\n    paddingHorizontal: 12,\n    height: 46,\n    marginBottom: 18,\n  },\n  searchIcon: {marginRight: 8},\n  searchInput: {\n    flex: 1,\n    fontFamily: FontFamily.robotoRegular,\n    fontSize: 15,\n    color: '#FFFFFF',\n    padding: 0,\n  },\n  clearGlyph: {marginLeft: 4},\n  sectionLabel: {\n    fontFamily: FontFamily.robotoRegular,\n    fontSize: 11,\n    letterSpacing: 1.2,\n    color: '#6B7090',\n    marginBottom: 10,\n    marginTop: 4,\n  },\n  grid: {\n    flexDirection: 'row',\n    flexWrap: 'wrap',\n    justifyContent: 'space-between',\n    marginBottom: 18,\n  },\n  tile: {\n    width: '23.5%',\n    marginBottom: 10,\n    height: 62,\n    borderRadius: 12,\n    backgroundColor: '#12122A',\n    borderWidth: 1,\n    borderColor: 'rgba(255,255,255,0.06)',\n    alignItems: 'center',\n    justifyContent: 'center',\n  },\n  tileActive: {\n    backgroundColor: 'rgba(139,92,246,0.18)',\n    borderColor: '#8B5CF6',\n  },\n  tileDial: {\n    fontFamily: FontFamily.robotoRegular,\n    fontSize: 12,\n    color: '#C9CCE4',\n    marginTop: 6,\n  },\n  tileDialActive: {color: '#FFFFFF', fontWeight: '600'},\n  list: {flex: 1},\n  row: {\n    flexDirection: 'row',\n    alignItems: 'center',\n    paddingVertical: 13,\n  },\n  rowName: {\n    flex: 1,\n    fontFamily: FontFamily.robotoRegular,\n    fontSize: 15,\n    color: '#E5E7F0',\n    marginLeft: 12,\n  },\n  rowDial: {\n    fontFamily: FontFamily.robotoRegular,\n    fontSize: 14,\n    color: '#6B7090',\n    marginLeft: 12,\n  },\n  emptyWrap: {flex: 1, alignItems: 'center', paddingTop: 40},\n  emptyText: {\n    fontFamily: FontFamily.robotoRegular,\n    fontSize: 14,\n    color: '#6B7090',\n  },\n  flagFallback: {borderRadius: 2, backgroundColor: '#2A2A45'},\n});\n";
const ROW_SRC = "                  <View style={styles.phoneRow}>\n                    <TouchableOpacity\n                      style={styles.countryTrigger}\n                      activeOpacity={0.8}\n                      onPress={() => setShowCountrySheet(true)}>\n                      <Image\n                        source={{uri: flagUrl(country[0], 40)}}\n                        style={styles.triggerFlag}\n                        resizeMode=\"cover\"\n                      />\n                      <Text style={styles.triggerDial}>{countryCode}</Text>\n                      <ChevronDown color=\"#8B8CAD\" size={16} style={styles.triggerChevron} />\n                    </TouchableOpacity>\n\n                    <View style={styles.phoneDivider} />\n\n                    <TextInput\n                      style={styles.phoneInput}\n                      value={phoneNumber}\n                      onChangeText={handlePhoneChange}\n                      keyboardType=\"phone-pad\"\n                      placeholder=\"Phone number\"\n                      placeholderTextColor=\"#8B8CAD\"\n                    />\n                  </View>\n\n                  <Text style={styles.countryName}>{country[1]}</Text>\n\n                  <CountryCodeSheet\n                    visible={showCountrySheet}\n                    selectedIso={country[0]}\n                    onSelect={c => {\n                      setCountry(c);\n                      setShowCountrySheet(false);\n                      if (error) setError('');\n                    }}\n                    onClose={() => setShowCountrySheet(false)}\n                  />\n\n";

// ---------------------------------------------------------------------------
// v26 - country picker rebuilt to the Figma design (item 1)
//
// Replaces react-native-phone-number-input's built-in picker with the sheet
// from the Ghost Mode Chat App prototype: a "Country code" bottom sheet with
// a search field, a POPULAR grid of twelve flag tiles, and the full country
// list - and real PNG flags, because Android has no flag-emoji font and
// renders emoji flags as two grey letters.
// ---------------------------------------------------------------------------

{
  fs.writeFileSync("src/components/PhoneNumberModal/countries.js", COUNTRIES_SRC);
  console.log("PATCH: created PhoneNumberModal/countries.js (248 countries)");

  fs.writeFileSync("src/components/PhoneNumberModal/CountryCodeSheet.js", SHEET_SRC);
  console.log("PATCH: created PhoneNumberModal/CountryCodeSheet.js");

  const PM = "src/components/PhoneNumberModal/PhoneNumberModal.js";
  let pm = readMust(PM);

  pm = replaceOnce(pm,
    "import PhoneInput from 'react-native-phone-number-input';",
    [
      "import CountryCodeSheet from './CountryCodeSheet';",
      "import {COUNTRIES, flagUrl} from './countries';",
      "",
      "const findByDial = dial => {",
      "  const d = String(dial || '').trim();",
      "  return COUNTRIES.find(c => c[2] === d) || null;",
      "};",
    ].join("\n"),
    "phone modal: swap PhoneInput for the custom sheet");

  pm = replaceOnce(pm,
    "  const [countryCode, setCountryCode] = useState(defaultCountryCode);",
    [
      "  // One source of truth for the dial code: the country the user picked.",
      "  const [country, setCountry] = useState(",
      "    () => findByDial(defaultCountryCode) || ['IN', 'India', '+91'],",
      "  );",
      "  const [showCountrySheet, setShowCountrySheet] = useState(false);",
      "  const countryCode = country[2];",
    ].join("\n"),
    "phone modal: country state");

  pm = replaceOnce(pm,
    [
      "    let dial = countryCode;",
      "    try {",
      "      const cc = phoneInputRef.current?.getCallingCode?.();",
      "      if (cc) dial = '+' + String(cc).replace(/^\\+/, '');",
      "    } catch (_) {}",
      "    setError('');",
      "    onVerify(dial, national);",
    ].join("\n"),
    [
      "    setError('');",
      "    onVerify(countryCode, national);",
    ].join("\n"),
    "phone modal: dial code comes from the picked country");

  // Replace the whole PhoneInput block with the design's trigger + input row.
  const START = "                  <View style={styles.inputContainer}>";
  const END = "                                    {error ? (";
  const s = pm.indexOf(START);
  const e = pm.indexOf(END);
  if (s === -1) throw new Error("PATCH: phone modal input row start anchor missing");
  if (e === -1 || e < s) throw new Error("PATCH: phone modal input row end anchor missing");
  pm = pm.slice(0, s) + ROW_SRC + pm.slice(e);

  fs.writeFileSync(PM, pm);
  console.log("PATCH: phone modal now uses the Figma country-code sheet");
}

{
  // Styles for the rebuilt input row.
  const PM = "src/components/PhoneNumberModal/PhoneNumberModal.js";
  let pm = readMust(PM);
  pm = replaceOnce(pm,
    "  countryCodeWrapper: {",
    [
      "  phoneRow: {",
      "    width: '100%',",
      "    flexDirection: 'row',",
      "    alignItems: 'center',",
      "    backgroundColor: '#111C46',",
      "    borderRadius: 12,",
      "    borderWidth: 1,",
      "    borderColor: 'rgba(0, 191, 255, 0.3)',",
      "    height: 54,",
      "    paddingHorizontal: 12,",
      "  },",
      "  countryTrigger: {flexDirection: 'row', alignItems: 'center', paddingRight: 10},",
      "  triggerFlag: {width: 24, height: 17, borderRadius: 2},",
      "  triggerDial: {",
      "    fontFamily: FontFamily.robotoRegular,",
      "    fontSize: 16,",
      "    color: '#FFFFFF',",
      "    marginLeft: 8,",
      "  },",
      "  triggerChevron: {marginLeft: 6},",
      "  phoneDivider: {",
      "    width: 1,",
      "    height: 26,",
      "    backgroundColor: 'rgba(0, 191, 255, 0.3)',",
      "  },",
      "  phoneInput: {",
      "    flex: 1,",
      "    fontFamily: FontFamily.robotoRegular,",
      "    fontSize: 16,",
      "    color: '#FFFFFF',",
      "    marginLeft: 12,",
      "    padding: 0,",
      "  },",
      "  countryName: {",
      "    fontFamily: FontFamily.robotoRegular,",
      "    fontSize: 12,",
      "    color: '#8B8CAD',",
      "    textAlign: 'center',",
      "    marginTop: 8,",
      "    marginBottom: 20,",
      "  },",
      "  countryCodeWrapper: {",
    ].join("\n"),
    "phone modal: input row styles");

  // The row markup uses Image; make sure it is imported.
  if (!/^\s*Image,$/m.test(pm)) {
    pm = replaceOnce(pm,
      "  Animated,\n  Modal,",
      "  Animated,\n  Image,\n  Modal,",
      "phone modal: Image import");
  }
  fs.writeFileSync(PM, pm);
  console.log("PATCH: phone modal input row styled to the design");
}

{
  // Remove the two leftovers from the old picker: a ref to a component that no
  // longer exists, and a setter for state that no longer exists.
  const PM = "src/components/PhoneNumberModal/PhoneNumberModal.js";
  let pm = readMust(PM);
  pm = replaceOnce(pm,
    "  const phoneInputRef = useRef(null);\n",
    "",
    "phone modal: drop dead phoneInputRef");
  pm = replaceOnce(pm,
    [
      "  const handleSelectCountryCode = code => {",
      "    setCountryCode(code);",
      "    setShowDropdown(false);",
    ].join("\n"),
    [
      "  const handleSelectCountryCode = () => {",
      "    setShowDropdown(false);",
    ].join("\n"),
    "phone modal: drop dead setCountryCode call");
  pm = replaceOnce(pm,
    "import {Phone} from 'lucide-react-native';",
    "import {ChevronDown, Phone} from 'lucide-react-native';",
    "phone modal: ChevronDown import");
  fs.writeFileSync(PM, pm);
  console.log("PATCH: phone modal old-picker leftovers removed");
}
